import subprocess
from subprocess import PIPE
import asyncio

from flask import Flask, jsonify
from flask_cors import CORS
from urllib.request import urlopen
import requests
import json

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route("/api/v1/play", methods=['GET','POST'])
def main():
    loop = asyncio.get_event_loop()
    loop.create_task(write_posted_code())
    out = loop.run_until_complete(run_posted_code())
    return jsonify(out)

@app.route("/", methods=['GET'])
def hello():
    return("hello")

async def write_posted_code():
    cmdString = "#!/bin/sh"
    cmdString = cmdString + "\n\n"
    cmdString = cmdString + "gcc hello.c"
    cmdString = cmdString + "\n\n"
    cmdString = cmdString + "./a.out"
    cmdString = cmdString + "\n\n"
    cmdString = cmdString + "go build hello.go"
    cmdString = cmdString + "\n\n"
    cmdString = cmdString + "./hello"
    cmdString = cmdString + "\n\n"
    cmdString = cmdString + "node hello.js"
    cmdString = cmdString + "\n\n"
    ###################################################
    cmdString = cmdString + "javac hello.java"
    cmdString = cmdString + "\n\n"
    cmdString = cmdString + "java hello"
    ###################################################
    cmdString = cmdString + "\n\n"
    cmdString = cmdString + "echo '-----------------------'"
    cmdString = cmdString + "ghc --make hello.hs"
    cmdString = cmdString + "\n\n"
    cmdString = cmdString + "./hello"

    text_file = open("play.sh", "wt")
    text_file.write(cmdString)

async def run_posted_code():
    try:
        proc = subprocess.run("sh play.sh", shell=True, stdout=PIPE, stderr=PIPE, text=True)
        out = proc.stdout
        print(out)
    except subprocess.CalledProcessError as e:
        print(f"returncode:{e.returncode}, output:{e.output}")
    return out

if __name__ == "__main__":
    app.run()