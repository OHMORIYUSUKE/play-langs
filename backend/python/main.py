import subprocess
from subprocess import PIPE,TimeoutExpired
import asyncio
from unittest import result
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from urllib.request import urlopen
import requests
import json

from PlayLang.PlayLangClass import PlayLangClass

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

api_version = "/api/v1"

@app.route(f"{api_version}/play", methods=['GET','POST'])
def main():
    if not request.json:
        return make_response('', 400)
    body = request.json
    result = PlayLangClass(code=body["code"], input=body["input"], lang=body["lang"]).main()
    return jsonify({"out":result['out'],"err": result['err']})

@app.route(f"{api_version}/user", methods=['GET'])
def hello():
    import pymysql
    import os

    connection = pymysql.connect(
        host="mysql",
        db="playLangs",
        user="root",
        password="root",
        charset="utf8",
        cursorclass=pymysql.cursors.DictCursor
    )

    sql = "SELECT * FROM user"
    cursor = connection.cursor()
    cursor.execute(sql)
    players = cursor.fetchall()

    cursor.close()
    connection.close()

    user_list = []
    for player in players:
        print(player["name"])
        user_list.append(player['name'])
    return {'users':user_list}


if __name__ == "__main__":
    app.run()