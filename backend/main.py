import os
import uuid
import random
import threading
import time
from models import db
from Crypto.Hash import keccak
from datetime import datetime
import binascii
from decimal import *
from flask_cors import CORS
from config import DevConfig
from flask_migrate import Migrate
from models import Account, User, Transaction, TransactionState
from flask_jwt_extended import JWTManager
from flask_restx import fields, Resource, Namespace, Api
from flask import Flask, request, jsonify, make_response, abort
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity
    )

from coin_marcet_cap import get_crypto_exchange_rate, get_available_exchange_valutes, get_retes_dictionay



app = Flask(__name__)
app.config.from_object(DevConfig)

CORS(app)

db.init_app(app)

migrate = Migrate(app, db)
JWTManager(app)

api = Api(app, doc='/docs')

auth_ns = Namespace('auth', description='Authhentication namespace')
transaction_ns = Namespace('transaction', description='Transactions namespace')
api.add_namespace(auth_ns)
api.add_namespace(transaction_ns)

with app.app_context():
        db.create_all()
    

# serializers

signup_model = auth_ns.model(
    'SignUp', 
    {
        "username":fields.String(),
        "email":fields.String(),
        "password":fields.String(),
        "firstname":fields.String(),
        "lastname":fields.String(),
        "address":fields.String(),
        "city":fields.String(),
        "country":fields.String(),
        "phone":fields.String()
    }
)

login_model = auth_ns.model(
    'Login', {
        'email':fields.String(),
        'password':fields.String(),
    }
)

user_edit_model = auth_ns.model(
    'User', 
    {
        "password":fields.String(),
        "firstname":fields.String(),
        "lastname":fields.String(),
        "address":fields.String(),
        "city":fields.String(),
        "country":fields.String(),
        "phone":fields.String()
    }
)

user_model = auth_ns.model(
    'User', 
    {
        "username":fields.String(),
        "email":fields.String(),
        "firstname":fields.String(),
        "lastname":fields.String(),
        "address":fields.String(),
        "city":fields.String(),
        "country":fields.String(),
        "phone":fields.String(),
        "isActive":fields.String()
    }
)

insert_money_model = transaction_ns.model(
    'InsertMoney', {
        'name': fields.String(),
        'account_id': fields.String(),
        'expired_date': fields.String(),
        'secure_code': fields.String(),
        'amount': fields.String()
    }
)
verify_user_model = auth_ns.model(
    'VerifyUser', {
        'card_number': fields.String(),
        'name': fields.String(),
        'expired_date': fields.String(),
        'secure_code': fields.String()
    }
)

# transaction serializers

transfer_money_model = transaction_ns.model(
    'TransferMoney', {
        'amount': fields.String(),
        'account_id': fields.String(),
        'to_user_email':fields.String()
    }
)

exchange_model = transaction_ns.model(
    'Exchange', {
        'amount': fields.String(),
        'old_currency':fields.String(),
        'account_id': fields.String(),
        'coin_name': fields.String(),
        'coin_value': fields.String(),
    }
)


@auth_ns.route('/signup')
class SigunUp(Resource):
    @auth_ns.expect(signup_model)
    def post(self): 
        data = request.get_json()
        
        username = data.get('username')
        email = data.get('email')

        db_user = User.query.filter_by(username=username).first()
        db_email = User.query.filter_by(email=email).first()

        if db_user is not None:
            return make_response({"message": f"User with username {username} already exists"}, 400)

        if db_email is not None:
            return abort(400, f"User with email {email} already exists")

        new_user = User(
            username = data.get('username'),
            email = data.get('email'),
            password = generate_password_hash(data.get('password')),
            firstname=data.get('firstname'),
            lastname=data.get('lastname'),
            address=data.get('address'),
            city=data.get('city'),
            country=data.get('country'),
            phone=data.get('phone'),
            isActive=False
        )
        new_user.save()
        user = User.query.filter_by(email=new_user.email).first()
        account = Account(
            id = str(uuid.uuid4()),
            user_id = user.id,
            balance=0,
            currency="USD",
        )
        
        account.save()
        
        return jsonify({"message": f"User created successfully"})

@auth_ns.route('/login')
class Login(Resource):
    @auth_ns.expect(login_model)
    def post(self):
        data = request.get_json()

        email = data.get('email')
        password = data.get('password')

        db_user = User.query.filter_by(email=email).first()
        
        if db_user and check_password_hash(db_user.password, password):
            access_token = create_access_token(identity=db_user.email)
            refresh_token = create_refresh_token(identity=db_user.email)
        else:
            return make_response(jsonify({"message": "Invalid email or password"}), 401)

        return jsonify({"access_token": access_token, "refresh_token":refresh_token, "userData": {
            "username":db_user.username,
            "email":db_user.email,
            "firstname":db_user.firstname,
            "lastname":db_user.lastname,
            "address":db_user.address,
            "city":db_user.city,
            "country":db_user.country,
            "phone":db_user.phone,
            "isActive":db_user.isActive
        }})

@auth_ns.route('/refresh')
class RefreshResource(Resource):
    @jwt_required(refresh=True)    
    def post(self):
        current_user = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user)
        return make_response(jsonify({"access_token": new_access_token}), 200)

@auth_ns.route('/edit-user')
class UserResource(Resource):
    @jwt_required()
    @auth_ns.marshal_with(user_model)
    def get(self):
        current_user = get_jwt_identity()
        print(current_user)
        user = User.query.filter_by(email = current_user).first()
        return user
    
    @jwt_required()
    @auth_ns.expect(user_edit_model)
    def put(self):
        data = request.get_json()
        current_user = get_jwt_identity()
        user = User.query.filter_by(email = current_user).first()
        
        user.update(
            generate_password_hash(data.get('password')),
            data.get('lastname'),
            data.get('firstname'),
            data.get('address'),
            data.get('city'),
            data.get('country'),
            data.get('phone'),
            )
        
        return jsonify({"message": f"User updated successfully"})

@auth_ns.route('/account-balance')
class AccountBalance(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        user = User.query.filter_by(email = current_user).first()
        accounts = Account.query.filter_by(user_id = user.id)

        retVal = []

        for account in accounts:
            account_data = {}
            account_data['id'] = account.id
            account_data['balance'] = account.balance
            account_data['currency'] = account.currency
            account_data['user_id'] = account.user_id
            retVal.append(account_data)

        return jsonify({"accounts":retVal})

@auth_ns.route('/verify-user')
class VerifyUser(Resource):
    @jwt_required()    
    @auth_ns.expect(verify_user_model)
    def post(self):
        card = request.get_json()

        current_user = get_jwt_identity()
        user = User.query.filter_by(email = current_user).first()

        if(user.isActive == True):
            return jsonify({'message' : 'User already activated.'})  

        user_account = Account.query.filter_by(user_id=user.id).first()
        user_account.AddToBalance(-1)
        user.activate()

        return jsonify({'message' : 'User successfully activated.'})     
















# Transactions 

@transaction_ns.route('/insert-money')
class InsertMoney(Resource):
    @jwt_required()
    @transaction_ns.expect(insert_money_model)
    def post(self):
        data = request.get_json()

        current_user = get_jwt_identity()
        user = User.query.filter_by(email = current_user).first()

        if(user.isActive == False):
            return jsonify({"message": f"User needs to be active for this operaton!"})

        account = Account.query.filter_by(user_id=user.id, id=data['account_id']).first()
        if account is None:
            return jsonify({"message": f"No such account found!"})
            
        amount = Decimal(data['amount'])
        account.AddToBalance(amount)

        return jsonify({"message": f"Money successfully inserted into your account!"})
    
    
@transaction_ns.route('/get-transactions')
class GetTransactions(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        user = User.query.filter_by(email = current_user).first()

        from_user_transactions = Transaction.query.filter(Transaction.from_user == user.id).all()
        to_user_transactions = Transaction.query.filter(Transaction.to_user == user.id).all()
        
        from_user = [transaction.serialize() for transaction in from_user_transactions]
        to_user = [transaction.serialize() for transaction in to_user_transactions]
        
        return jsonify({"from_user": from_user, "to_user": to_user})
        
   
    
def thread_function(amount,from_user_id, to_user_id, currency, keccak_string, accountFrom, accountTo):
    with app.app_context():
        now = datetime.now()
        dt_string = now.strftime("%d/%m/%Y %H:%M:%S")

        transaction = Transaction(
            amount = amount,
            from_user = from_user_id,
            to_user = to_user_id,
            currency = currency,
            transaction_hash = keccak_string,
            transaction_state = TransactionState.PROCESSING,
            transaction_date = dt_string
        )
        
        if((accountFrom.balance - amount) < 0):
            transaction.transaction_state = TransactionState.REJECTED
            transaction.save()
            print("\n\nTransaction rejected\n\n")
            return

        accountFrom.AddToBalance(-amount)
        accountTo.AddToBalance(amount)
        

        transaction.save()
        print(datetime.now().time())
        time.sleep(5*60)
        print(datetime.now().time())
        transaction.transaction_state = TransactionState.PROCESSED
        transaction.save()


@transaction_ns.route('/transfer-money')
class TransferMoney(Resource):
    @jwt_required()
    @transaction_ns.expect(transfer_money_model)
    def post(self):
        request_data = request.get_json()
        current_user = get_jwt_identity()   
        from_user = User.query.filter_by(email = current_user).first()
        
        if(from_user.isActive == False):
            return jsonify({"message": f"You must activate user!"})

        to_user = User.query.filter_by(email = request_data['to_user_email']).first()

        if to_user is None:
            return jsonify({"message": f"Unable to transfer money. No such user."})

        accountFrom = Account.query.filter_by(user_id=from_user.id, id=request_data['account_id']).first()

        if accountFrom is None:
            return jsonify({"message": f"Unable to transfer money. Unable to find account with given account id"})

        accountTo = Account.query.filter_by(user_id=to_user.id, currency=accountFrom.currency).first()

        amount = Decimal(request_data['amount'])
        
        if accountTo is None:
            accountTo = Account(
                            id = str(uuid.uuid4()),
                            user_id = to_user.id,
                            balance=0,
                            currency=accountFrom.currency,
                            )
            accountTo.save()
            
        
        keccak_data = f"{from_user.id}|{to_user.id}|{amount}|{random.randint(0, 1000)}"
        keccak256 = keccak.new(data=str.encode(keccak_data), digest_bits=256).digest()
        keccac_byte = binascii.hexlify(keccak256)
        keccak_string = keccac_byte.decode()

        x = threading.Thread(target=thread_function, args=(amount,from_user.id, to_user.id, accountFrom.currency, keccak_string, accountFrom, accountTo))
        x.start()
        
        

        return jsonify({"message": f"Money transfer initiated!"})
    

@transaction_ns.route('/exchange')
class Exchange(Resource):
    @jwt_required()
    @transaction_ns.expect(exchange_model)
    def post(self):
        data = request.get_json()


        current_user = get_jwt_identity()
        user = User.query.filter_by(email = current_user).first()

        if(user.isActive == False):
            return jsonify({"message": f"User needs to be active for this operaton!"})

        account = Account.query.filter_by(user_id=user.id, currency=f"{data['old_currency']}").first()
        if account is None:
            return jsonify({"message": f"The account you try to send money from doesn't exist!"})
        
        exchange_rates = get_crypto_exchange_rate()[:20]
        available_exchange_rates = get_available_exchange_valutes()
        rates_dictionary = get_retes_dictionay()
        old_currency = data['old_currency']
        
        if (data['old_currency'] in available_exchange_rates):
            old_currency_rate = Decimal(rates_dictionary[data['old_currency']]) # transfered into dolars
        else:
            old_currency_rate = 1
            
        
        coin_name =  data['coin_name']
        # print(exchange_rates)
        amount = Decimal(data['amount'])
        
        accountTo = Account.query.filter_by(user_id=user.id, currency=coin_name).first()

        if accountTo is None:
            accountTo = Account(
                            id = str(uuid.uuid4()),
                            user_id = user.id,
                            balance=0,
                            currency=coin_name,
                            )
            
        new_currency_rate = Decimal(data['coin_value']) # transfered into dolars
        
                        # in dolars                     # in dolars
        if ((account.balance * old_currency_rate) - (amount * new_currency_rate) < 0):
            return jsonify({"message": f"You don't have enough money"})
        
        account.AddToBalance(-((amount * new_currency_rate)/old_currency_rate))
        
        accountTo.AddToBalance(amount)

        return jsonify({"message": f"Exchange initiated!"})
    



















@transaction_ns.route('/exchange-rate')
class ExchangeRate(Resource):
    def get(self):
        exchange_rates = get_crypto_exchange_rate()[:20]
        return jsonify({"exchange_rate": exchange_rates})






@app.route("/", methods=['POST','GET'])
def default_example():
   if request.method == 'GET':
        return "hello world"
    
    
@app.shell_context_processor
def make_shell_context():
    return {
        "db":db, 
        "User":User,
        "Account":Account
    }
      

if __name__ == "__main__":
  app.run(debug=True, use_debugger=False, use_reloader=False)