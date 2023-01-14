from flask import Flask, send_file
import psycopg2
import random

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

@app.route("/changeImage")
def getNotes():
    connection = psycopg2.connect(user="root", password="root", host="localhost", port="5432", dbname="flaskdata")
    cursor = connection.cursor()
    cursor.execute("select count(id) from urls;")
    count = cursor.fetchone()[0]
    randid = random.randrange(0,count+1)
    cursor.execute("select * from urls where id = {};".format(randid))
    return cursor.fetchone()[1]

@app.route("/Javascript/opening-page.js")
def opening_page_js():
    js = open("Javascript/opening-page.js")
    return js.read()
