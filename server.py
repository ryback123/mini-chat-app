from flask import Flask, jsonify, request, render_template
import sqlite3
app = Flask(__name__)

@app.route("/")
def renderPage():
    return render_template("index.html")

@app.route("/message", methods=['POST', 'GET'])
def updateMessage():
    con = sqlite3.connect("msgs.sqlite")
    cur = con.cursor()
    if request.method =="POST":
        req = request.get_json()
        cur.execute("INSERT INTO msgs(USER, MESSAGE) VALUES (?, ?)", (req["user"],req["msg"]))
        con.commit()
    cur.execute("SELECT USER, MESSAGE FROM msgs")
    msg_list = list()
    for row in cur:
        msg_list.append({"user":row[0], "msg":row[1]})
    return jsonify({"msg_list":msg_list})

if __name__ == "__main__":
    app.run(debug=True)
