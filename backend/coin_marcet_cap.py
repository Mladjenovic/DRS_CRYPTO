 #This example uses Python 2.7 and the python-request library.

from requests import Request, Session
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
import json

def get_crypto_exchange_rate():
    url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest'
    parameters = {
    'start':'1',
    'limit':'50',
    'convert':'USD'
    }
    headers = {
    'Accepts': 'application/json',
    'X-CMC_PRO_API_KEY': '4c8ded23-3fbc-4dde-86f0-9b93f51e268a',
    }

    session = Session()
    session.headers.update(headers)

    try:
        response = session.get(url, params=parameters)
        data = json.loads(response.text)
        retval = []
        for data in data.get('data'):
            symbol = data.get('symbol')
            price = data.get('quote').get('USD').get('price')
            retval.append({"coin": symbol, "price": price})

        return retval
        
    except (ConnectionError, Timeout, TooManyRedirects) as e:
        print(e)