# Imports
from flask import Flask, redirect, request, Response
import psycopg2
from hashlib import sha256
import jwt
from datetime import datetime
from random import sample
from os import getenv, environ


# Constants - General
PORT = 8080
DIRECTORY_PATH = 'SuperDushGambler'
TZ = "Israel"
# Constants - Postgres
POSTGRES_USERNAME = 'postgres'
POSTGRES_PASSWORD = getenv('POSTGRES_PASSWORD', 'password')
POSTGRES_HOST = getenv('POSTGRES_HOST', 'localhost')
POSTGRES_PORT = '5432'



def dbInsurance():
    connection = psycopg2.connect(user=POSTGRES_USERNAME, password=POSTGRES_PASSWORD, host=POSTGRES_HOST, port=POSTGRES_PORT, database="postgres")
    connection.autocommit = True
    pg = connection.cursor()
    try:
        pg.execute('''CREATE database superdush_db''')
    except:
        pass
    connection.close()

    try:
        queryDB('''CREATE TABLE superdush_table (username TEXT NOT NULL PRIMARY KEY, hash TEXT NOT NULL, credits numeric NOT NULL DEFAULT 100, last_credits_collection DATE, bet numeric NOT NULL DEFAULT 0, game VARCHAR(25) NOT NULL DEFAULT 'GGGGGGGGGGGGGGGGGGGGGGGGG')''')
    except:
        pass

def queryDB(query):
    connection = psycopg2.connect(user=POSTGRES_USERNAME, password=POSTGRES_PASSWORD, host=POSTGRES_HOST, port=POSTGRES_PORT, database="superdush_db")
    connection.autocommit = True
    pg = connection.cursor()
    pg.execute(query)
    try:
        fetchall = pg.fetchall()
    except:
        fetchall = None
    connection.close()
    return fetchall

def jwtEncoder(username):
    epoch_time = int(str(datetime.now().timestamp()).split('.')[0])
    payload_data = {"username": username, "iat": epoch_time}
    token = jwt.encode(payload=payload_data, key='NoDeRnEdErBeImAsHeLi')
    return token

def jwtVerifier(token):
    try:
        payload = jwt.decode(token, 'NoDeRnEdErBeImAsHeLi', algorithms=['HS256'])
        isValid = (payload['iat'] + 86400 - int(str(datetime.now().timestamp()).split('.')[0]) > 0) and doesUserExists(payload['username'])
    except jwt.exceptions.InvalidTokenError as token_exception:
        return False
    return isValid

def doesUserExists(username):
    return bool(queryDB(f"SELECT username FROM superdush_table WHERE username = '{username}'"))

def isCookieValid(func):
    def Logging(*args, **kwargs):
        accessToken = request.cookies.get('accessToken')
        if not jwtVerifier(accessToken):
            return redirect('/logging', code=302)
        username = jwt.decode(accessToken, 'NoDeRnEdErBeImAsHeLi', algorithms=['HS256'])['username']
        return func(*args, **kwargs, username=username)
    Logging.__name__ = func.__name__
    Logging.__doc__ = func.__doc__
    return Logging

def doIHaveEnoughCredits(username, requestedCredits):
    Actualcredits = float(queryDB(f"SELECT credits FROM superdush_table WHERE username = '{username}'")[0][0])
    return requestedCredits > 0 and requestedCredits <= Actualcredits

def factorial(n):
    final = 1
    for i in range(1, n):
        final *= i
    return final

def howMuchDidIEarn(bet, mines, gems):
    korenpDontWantYouToWin = 0.97
    pWin = factorial(25 - mines) * factorial(25 - gems) / factorial(25) / factorial(25 - mines - gems)
    pWin = round(pWin, 2)
    earned = 1 / pWin * korenpDontWantYouToWin * bet
    earned = round(earned, 2)
    return earned


app = Flask(__name__, static_folder=DIRECTORY_PATH)

@app.route('/')
@isCookieValid
def index(username):
    return app.send_static_file('index.html')

@app.route('/getCredits')
@isCookieValid
def getCredits(username):
    credits = queryDB(f"SELECT credits FROM superdush_table WHERE username = '{username}'")[0][0]
    return Response(str(credits), status=200)

@app.route('/doesAbleToCollectCredits')
@isCookieValid
def doesAbleToCollectCredits(username):
    last_credits_collection = queryDB(f"SELECT last_credits_collection FROM superdush_table WHERE username = '{username}'")[0][0]
    now = datetime.now().date()
    if last_credits_collection == None or last_credits_collection < now:
        return Response('True', status=200)
    return Response('False', status=200)

@app.route('/collectCredits')
@isCookieValid
def collectCredits(username):
    last_credits_collection = queryDB(f"SELECT last_credits_collection FROM superdush_table WHERE username = '{username}'")[0][0]
    now = datetime.now().date()
    if last_credits_collection == None or last_credits_collection < now:
        queryDB(f"UPDATE superdush_table SET credits = credits + 10, last_credits_collection = '{now}' WHERE username = '{username}'")
        return Response('Success', status=200)
    return Response('Failed', status=200)

@app.route('/index.html')
def indexRedirect():
    return redirect('/', code=302)

@app.route('/leaderboards')
def leadeboardsServe():
    return app.send_static_file('html/leaderboards.html')

@app.route('/html/leaderboards.html')
def leaderboardsRedirect():
    return redirect('/leaderboards', code=302)

@app.route('/<path:path>')
def static_files(path):
    return app.send_static_file(path)

@app.route('/logging')
def logging():
    return app.send_static_file('html/logging.html')

@app.route('/login', methods=['POST'])
def login():

    username = request.form.get("username")
    password = request.form.get("password")

    if not (username and password):
        return Response("Must Declare Both Credentials!", status=422)

    if not username.isalnum():
        return Response("Please Do Not Use Symbols Or Spaces", status=422)
    
    try:
        hashed_password = queryDB(f"SELECT hash FROM superdush_table WHERE username = '{username}'")[0][0]
    except:
        return Response("Invalid Credentials", status=422)
    
    if hashed_password == sha256(password.encode('utf-8')).hexdigest():
        response = Response("Logged In! :)", status=200)
        response.set_cookie('accessToken', jwtEncoder(username), httponly=True)
        return response
    
    return Response("Invalid Credentials", status=422)

@app.route('/signup', methods=['POST'])
def signup():

    username = request.form.get("username")
    password = request.form.get("password")

    if not (username and password):
        return Response("Must Declare Both Credentials!", status=422)

    if not username.isalnum():
        return Response("Please Do Not Use Symbols Or Spaces", status=422)
    
    isUsernameExist = bool(queryDB(f"SELECT username FROM superdush_table WHERE username = '{username}'"))
    if isUsernameExist:
        return Response("Username already exists :(", status=422)

    hashed_password = sha256(password.encode('utf-8')).hexdigest()

    queryDB(f"INSERT INTO superdush_table VALUES ('{username}', '{hashed_password}')")

    return Response("Signed Up Successfully! :)", status=200)

@app.route('/startGame', methods=['POST'])
@isCookieValid
def startGame(username):

    betCredits = float(request.form.get("betCredits"))
    mineCount = int(request.form.get("mineCount"))

    if not (betCredits > 0 and mineCount > 0 and mineCount < 25):
        return Response("Invalid Values", status=422)
    
    if not doIHaveEnoughCredits(username, betCredits):
        return Response("You Don't Have Enough Credits", status=422)
    
    game = 'B' * mineCount + 'X' * (25 - mineCount)
    game = ''.join(sample(game, len(game)))

    queryDB(f"UPDATE superdush_table SET game = '{game}', bet = {betCredits}, credits = credits - {betCredits} WHERE username = '{username}'")

    return Response("Game Created", status=200)

@app.route('/loadGame')
@isCookieValid
def loadGame(username):
    # X = Not Bomb And Not Clicked
    # B = Bomb
    # G = Clicked And Not Bomb
    game, bet = queryDB(f"SELECT game, bet FROM superdush_table WHERE username = '{username}'")[0]
    mines = game.count('B')
    classifiedGame = game.replace('B', 'X')
    data = f"{classifiedGame} {bet} {mines}"
    return Response(data, status=200)

@app.route('/submit', methods=['POST'])
@isCookieValid
def submit(username):
    divLocation = int(request.form.get("divLocation", -1))
    if divLocation > 24 or divLocation < 0:
        return redirect('/logging', code=302)
    game = queryDB(f"SELECT game FROM superdush_table WHERE username = '{username}'")[0][0]
    divValue = game[divLocation]
    isBomb = True if divValue == 'B' else False
    if not isBomb:
        game = game[:divLocation] + 'G' + game[divLocation + 1:]
        queryDB(f"UPDATE superdush_table SET game = '{game}' WHERE username = '{username}'")
        return Response("NotBomb", status=200)
    else:
        queryDB(f"UPDATE superdush_table SET game = 'GGGGGGGGGGGGGGGGGGGGGGGGG', bet = 0 WHERE username = '{username}'")
        return Response(game, status=200)

@app.route('/cashout')
@isCookieValid
def cashout(username):
    game, bet = queryDB(f"SELECT game, bet FROM superdush_table WHERE username = '{username}'")[0]
    bet = float(bet)
    mines = game.count('B')
    gems = game.count('G')
    earned = howMuchDidIEarn(bet, mines, gems)
    queryDB(f"UPDATE superdush_table SET credits = credits + {earned}, game = 'GGGGGGGGGGGGGGGGGGGGGGGGG', bet = 0 WHERE username = '{username}'")
    return Response(str(earned), status=200)

@app.route('/getLeaderboards')
def getLeaderboards():
    leaderboards = queryDB('SELECT username, credits FROM superdush_table ORDER BY credits DESC LIMIT 10')
    strSortedLeaderboards = '\n'.join(f'{credits} {username}' for username, credits in leaderboards)
    return Response(strSortedLeaderboards ,status=200)



def main():

    environ['TZ'] = TZ

    dbInsurance()

    app.run(host = '0.0.0.0', port = PORT)

if __name__ == '__main__':
    main()