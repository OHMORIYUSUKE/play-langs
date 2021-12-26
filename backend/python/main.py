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

async def task_one():
    cmdString = "#!/bin/sh"
    cmdString = cmdString + "\n\n"
    cmdString = cmdString + "python3 test.py"

    text_file = open("play.sh", "wt")
    text_file.write(cmdString)

async def task_two():
    proc = subprocess.run("sh play.sh", shell=True, stdout=PIPE, stderr=PIPE, text=True)
    out = proc.stdout
    print(out)
    return out


@app.route("/api/v1", methods=['GET'])
def main():
    loop = asyncio.get_event_loop()
    loop.create_task(task_one())
    out = loop.run_until_complete(task_two())
    return jsonify(out)

if __name__ == "__main__":
    app.run()