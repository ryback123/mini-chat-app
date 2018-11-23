from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import sqlite3

msgdb = sqlite3.connect("msgs.sqlite")
msgcur = msgdb.cursor()
msgcur.executescript("""
CREATE TABLE IF NOT EXISTS MSGS(
SNO INTEGER PRIMARY KEY AUTOINCREMENT,
USER TEXT NOT NULL,
MSG TEXT NOT NULL,
ID INTEGER NOT NULL
);""")
msgdb.commit()

userdb = sqlite3.connect("users.sqlite")
usercur = userdb.cursor()
usercur.executescript("""
CREATE TABLE IF NOT EXISTS USERS(
SNO INTEGER PRIMARY KEY AUTOINCREMENT,
USER TEXT NOT NULL,
ID INTEGER NOT NULL
);""")
userdb.commit()

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origin": "http://localhost:8000/", "supports_credentials": "true"}}) #Add address of client

@app.route("/")
def renderPage():
    return render_template("index.html")

@app.route("/message", methods=['POST', 'GET'])
def updateMessage():
    con = sqlite3.connect("msgs.sqlite")
    cur = con.cursor()
    if request.method =="POST":
        req = request.get_json()
        cur.execute("INSERT INTO MSGS(USER, MSG, ID) VALUES (?, ?, ?)", (req["user"],req["msg"], req["id"]))
        con.commit()
    cur.execute("SELECT USER, MSG, ID FROM MSGS")
    msg_list = list()
    for row in cur:
        msg_list.append({"user":row[0], "msg":row[1], "id":row[2]})
    return jsonify({"msg_list":msg_list})

@app.route("/user/add", methods=['POST', 'GET'])
def addOnlineUsers():
    con = sqlite3.connect("users.sqlite")
    cur = con.cursor()
    if request.method =="POST":
        req = request.get_json()
        i=0
        cur.execute("SELECT USER, ID FROM USERS WHERE ID=(?)", (req["id"],))
        for row in cur:
            i+=1
        if i==0:
            cur.execute("INSERT INTO USERS(USER, ID) VALUES (?, ?)", (req["user"],req["id"]))
            con.commit()
    cur.execute("SELECT USER, ID FROM USERS")
    users_list = list()
    for row in cur:
        users_list.append({"user":row[0], "id":row[1]})
    return jsonify({"user_list": users_list})

@app.route("/user/remove", methods=['POST'])
def removeOnlineUsers():
    req = request.get_json()
    con = sqlite3.connect("users.sqlite")
    cur = con.cursor()
    cur.execute("DELETE FROM USERS WHERE ID=(?)", (req["id"],))
    con.commit()
    return jsonify({"status":"deleted"})


if __name__ == "__main__":
    app.run(port=8000)

