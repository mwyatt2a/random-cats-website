from flask import Flask, send_file
import psycopg2

app = Flask(__name__)

@app.route("/")
def opening_page_hmtl():
    html = open("HTML/opening-page.html")
    return html.read()

@app.route("/CSS/style.css")
def getStyle():
    return send_file("CSS/style.css", mimetype="text/css")

@app.route("/Images/cat.png")
def getImage():
    return send_file("Images/cat.png", mimetype="image/png")

@app.route("/getNotes")
def getNotes():
    connection = psycopg2.connect(user="root", password="root", host="localhost", port="5432", dbname="flaskdata")
    cursor = connection.cursor()
    cursor.execute("select * from test")
    counter = cursor.fetchone()[0]
    cursor.execute("delete from test")
    cursor.execute("insert into test values ('{}')".format(int(counter) + 1))
    connection.commit()
    cursor.execute("select * from test")
    return cursor.fetchone()[0]

@app.route("/Javascript/opening-page.js")
def opening_page_js():
    js = open("Javascript/opening-page.js")
    return js.read()
