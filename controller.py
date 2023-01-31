from flask import Flask, send_file, request, jsonify, Response
import psycopg2
import random
import subprocess

app = Flask(__name__)

@app.route("/")
def opening_page_hmtl():
    return send_file("html/page.html", mimetype="text/html")

@app.route("/test")
def webgl_html():
    return send_file("html/webgl.html", mimetype="text/html")

@app.route("/testbmp")
def webgl_bmp():
    return send_file("resources/blackbuck.bmp", mimetype="image/bmp")

@app.route("/resources/favicon.ico")
def getFavicon():
    return send_file("resources/favicon.ico", mimetype="image/x-icon")

@app.route("/css/style.css")
def getStyle():
    return send_file("css/style.css", mimetype="text/css")

@app.route("/resources/meow")
def getMp3():
    randfile = str(random.randrange(0,14))
    print(randfile)
    return send_file("resources/meow" + randfile + ".mp3", mimetype="audio/mpeg")

@app.route("/changeimage")
def newImage():
    seen = request.args.getlist("seen")
    connection = psycopg2.connect(user="root", password="VBh9vIXCqaMNOFdb2E3T7PxEXAiHDpmq", host="dpg-cf6e7e9mbjsmchenr54g-a.ohio-postgres.render.com", port="5432", dbname="flaskdata")
    cursor = connection.cursor()
    cursor.execute("select max(id) from urls;")
    maxid = cursor.fetchone()[0]
    randid = random.randrange(1,maxid+1)
    cursor.execute("select * from urls where id >= {} and id not in ({}, {}, {}, {}, {}, {}, {}, {}, {}, {}) order by id limit 1;".format(randid, seen[0], seen[1], seen[2], seen[3], seen[4], seen[5], seen[6], seen[7], seen[8], seen[9]))
    row = cursor.fetchone()
    if row == None:
        cursor.execute("select * from urls where id < {} and id not in ({}, {}, {}, {}, {}, {}, {}, {}, {}, {}) order by id desc limit 1;".format(randid, seen[0], seen[1], seen[2], seen[3], seen[4], seen[5], seen[6], seen[7], seen[8], seen[9]))
        row = cursor.fetchone()
    catid = row[0]
    url = row[1]
    views = row[2]
    cursor.execute("update urls set views = views + 1 where id = {};".format(row[0]))
    connection.commit()
    connection.close()
    return jsonify({"id": catid, "url": url, "views": views + 1})

@app.route("/javascript/page.js")
def webgl_js():
    return send_file("javascript/page.js", mimetype="text/javascript")

@app.route("/javascript/webgl.js")
def opening_page_js():
    return send_file("javascript/webgl.js", mimetype="text/javascript")

@app.route("/add", methods=["GET"])
def addURL():
    params = request.args
    url = params.get("url")
    generated = str(random.randrange(0,1000000000000))
    try:
        subprocess.call(["curl", "-o", "/tmp/download:" + generated, url], timeout=10)
        subprocess.call("file /tmp/download:" + generated + "| grep -ic 'apng/|avif\|gif\|jpeg\|png\|svg\|webp\|bmp\|ico\|tiff' > /tmp/count:" + generated, timeout=10, shell=True)
        file = open("/tmp/count:" + generated, "r");
        result = int(file.read())
        subprocess.call("rm /tmp/download:" + generated + " /tmp/count:" + generated, timeout=10, shell=True)
    except:
        return "timeout"
    if result == 0:
        return "bad url"
    connection = psycopg2.connect(user="root", password="VBh9vIXCqaMNOFdb2E3T7PxEXAiHDpmq", host="dpg-cf6e7e9mbjsmchenr54g-a.ohio-postgres.render.com", port="5432", dbname="flaskdata")
    cursor = connection.cursor()
    cursor.execute("select count(id) from urls where url = '{}';".format(url))
    duplicate = cursor.fetchone()[0]
    if duplicate != 0:
        return "duplicate"
    cursor.execute("insert into urls (url, reports, views) values ('{}', 0, 0);".format(url))
    connection.commit()
    connection.close()
    return "success"
   
@app.route("/bad", methods=["POST"])
def badURL():
    url = request.data.decode("UTF-8")
    connection = psycopg2.connect(user="root", password="VBh9vIXCqaMNOFdb2E3T7PxEXAiHDpmq", host="dpg-cf6e7e9mbjsmchenr54g-a.ohio-postgres.render.com", port="5432", dbname="flaskdata")
    cursor = connection.cursor()
    cursor.execute("update urls set reports = reports + 1 where url = '{}'".format(url))
    cursor.execute("delete from urls where url = '{}' and cast(reports as double precision)/views >= 0.01".format(url))
    connection.commit()
    connection.close()
    return Response(status=204)
