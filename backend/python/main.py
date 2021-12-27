import subprocess
from subprocess import PIPE
import asyncio

from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from urllib.request import urlopen
import requests
import json

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route("/api/v1/play", methods=['GET','POST'])
def main():
    if not request.json:
        return make_response('', 400)
    print(request.json)
    body = request.json
    code = body["code"]
    input = body["input"]
    lang = body["lang"]
    print(code)
    print(input)
    print(lang)
    loop = asyncio.get_event_loop()
    loop.create_task(write_posted_code(code,lang,input))
    result = loop.run_until_complete(run_posted_code(lang))
    print(result[0]) # out (正常終了)
    print(result[1]) # err (異常終了)
    return jsonify({"out":result[0],"err": result[1]})

@app.route("/", methods=['GET'])
def hello():
    return("hello")

async def write_posted_code(code,lang,input):
    langFile = ""
    if lang is 'C':
        langFile = "c"
    print("hello."+langFile)
    text_file = open("hello."+langFile, "wt")
    text_file.write(code)
    ###
    text_file = open("input.in", "wt")
    text_file.write(input)

async def run_posted_code(lang):
    try:
        langFile = ""
        if lang is 'C':
            langFile = "c"
        print("sh hello."+langFile)
        proc = subprocess.run("sh "+langFile+".sh < input.in", shell=True, stdout=PIPE, stderr=PIPE, text=True)
        out = proc.stdout
        err = proc.stderr # エラーメッセージ
        print(out)
    except subprocess.CalledProcessError as e:
        print(f"returncode:{e.returncode}, output:{e.output}")
    return out,err

if __name__ == "__main__":
    app.run()