from flask_sqlalchemy import SQLAlchemy
db=SQLAlchemy()

from enum import Enum

#User model 

"""
Class User:
    id:integer
    username:string
    email:string
    password:string
    lastname:string
    firstname:string
    address:string
    city:string
    coutnry:string
    phone:string
    isActive:boolean
"""

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(25), nullable=False, unique=True)
    email = db.Column(db.String(25), nullable=False, unique=True)
    password = db.Column(db.Text(), nullable=False)
    lastname = db.Column(db.String(50), nullable=False)
    firstname = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(50), nullable=False)
    city = db.Column(db.String(50), nullable=False)
    country = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    isActive = db.Column(db.Boolean, nullable=False)

    def _repr_(self):
        return f'<User {self.username}>'

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self, password, lastname, firstname, address, city, country, phone):
        self.password = password
        self.lastname = lastname
        self.firstname = firstname
        self.address = address
        self.city = city
        self.country = country
        self.phone = phone
        db.session.commit()
    
    def activate(self):
        self.isActive = True
        db.session.commit()


#Account model 

"""
Class User:
    id:string
    balance:decimal
    currency:string
    user_id:integer
"""   

class Account(db.Model):
    id = db.Column(db.String, primary_key=True)
    balance = db.Column(db.DECIMAL(12,2), nullable=False)
    currency = db.Column(db.String(3), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(User.id))

    def save(self):
        db.session.add(self)
        db.session.commit()

    def AddToBalance(self, amount):
        self.balance = self.balance + amount
        db.session.add(self)
        db.session.commit()



class TransactionState(Enum):
    PROCESSING = 1
    PROCESSED = 2
    REJECTED = 3


class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Numeric, nullable=False)
    from_user = db.Column(db.Integer, db.ForeignKey(User.id))
    to_user = db.Column(db.Integer, db.ForeignKey(User.id))
    currency = db.Column(db.String(3), nullable=False)
    transaction_hash = db.Column(db.String(), nullable=False)
    transaction_state = db.Column(db.Enum(TransactionState))
    transaction_date = db.Column(db.String())

    def save(self):
        db.session.add(self)
        db.session.commit()
        
    def serialize(self):
        return {
            "id":self.id,
            "amount":self.amount,
            "from_user":self.from_user,
            "to_user":self.to_user, 
            "currency":self.currency,
            "transaction_hash": self.transaction_hash,
            "transaction_state":str(self.transaction_state),
            "transaction_date":self.transaction_date
            }