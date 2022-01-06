import os
import uuid
from flask import Flask
from flask_restx import fields, Resource, Namespace, Api
from flask_cors import CORS
from config import DevConfig
from flask import Flask, request, jsonify, make_response
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from models import Account, User
from werkzeug.security import generate_password_hash, check_password_hash
from models import db


app = Flask(__name__)
app.config.from_object(DevConfig)

CORS(app)

db.init_app(app)

migrate = Migrate(app, db)
JWTManager(app)

api = Api(app, doc='/docs')

auth_ns = Namespace('auth', description='Authhentication namespace')
api.add_namespace(auth_ns)
    

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
            return jsonify({"message": f"User with username {username} already exists"})

        if db_email is not None:
            return jsonify({"message": f"User with email {email} already exists"})

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
            currency="RSD",
        )
        
        account.save()
        
        return jsonify({"message": f"User created successfully"})


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