from flask import Flask, send_file, request
import psycopg2
import random

app = Flask(__name__)

@app.route("/")
def opening_page_hmtl():
    return send_file("HTML/opening-page.html", mimetype="text/html")

@app.route("/images/favicon.ico")
def getFavicon():
    return send_file("Images/favicon.ico", mimetype="image/x-icon")

@app.route("/CSS/style.css")
def getStyle():
    return send_file("CSS/style.css", mimetype="text/css")

@app.route("/changeImage")
def newImage():
    connection = psycopg2.connect(user="root", password="root", host="localhost", port="5432", dbname="flaskdata")
    cursor = connection.cursor()
    cursor.execute("select count(id) from urls;")
    count = cursor.fetchone()[0]
    randid = random.randrange(1,count+1)
    cursor.execute("select * from urls where id = {};".format(randid))
    url = cursor.fetchone()[1]
    connection.close()
    return url
@app.route("/Javascript/opening-page.js")
def opening_page_js():
    return send_file("Javascript/opening-page.js", mimetype="text/javascript")

@app.route("/add", methods=["GET"])
def addURL():
    params = request.args
    url = params.get("url")
    connection = psycopg2.connect(user="root", password="root", host="localhost", port="5432", dbname="flaskdata")
    cursor = connection.cursor()
    cursor.execute("insert into urls (url, reports, views) values ('{}', 0, 0);".format(url))
    connection.commit()
    connection.close()
    return "success"
   
