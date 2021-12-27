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
def main(request):
    loop = asyncio.get_event_loop()
    loop.create_task(write_posted_code(request))
    out = loop.run_until_complete(run_posted_code())
    return jsonify(out)

@app.route("/", methods=['GET'])
def hello():
    return("hello")

async def write_posted_code(request):
    body = request.json
    print(body)
    cmdString = "#!/bin/sh"
    cmdString = cmdString + "\n\n"
    cmdString = cmdString + "python3 test.py"

    text_file = open("play.sh", "wt")
    text_file.write(cmdString)

async def run_posted_code():
    proc = subprocess.run("sh play.sh", shell=True, stdout=PIPE, stderr=PIPE, text=True)
    out = proc.stdout
    print(out)
    return out

if __name__ == "__main__":
    app.run()