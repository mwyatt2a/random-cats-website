from flask import Flask
import psycopg2

app = Flask(__name__)

@app.route("/")
def opening_page_hmtl():
    html = open("HTML/opening_page.html")
    return html.read()

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

@app.route("/Javascript/opening_page.js")
def opening_page_js():
    js = open("Javascript/opening_page.js")
    return js.read()
