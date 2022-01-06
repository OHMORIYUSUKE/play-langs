import subprocess
from subprocess import PIPE,TimeoutExpired
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
    loop = asyncio.get_event_loop()
    loop.create_task(write_posted_code(code,lang,input))
    result = loop.run_until_complete(run_posted_code(lang))
    print(result)
    print(result[0]) # out (正常終了)
    print(result[1]) # err (異常終了)
    return jsonify({"out":result[0],"err": result[1]})

@app.route("/", methods=['GET'])
def hello():
    return("hello")

async def write_posted_code(code,lang,input):
    print("言語 : "+lang)
    langFile = select_lang(lang)
    ## コードをファイルに書き込む
    print("hello."+langFile)
    text_file = open("hello."+langFile, "wt")
    text_file.write(code)
    ## inputを与える
    text_file = open("input.in", "wt")
    text_file.write(input)

async def run_posted_code(lang):
    try:
        print("言語 : "+lang)
        langFile = select_lang(lang)
        print("sh hello."+langFile)
        proc = subprocess.run("sh "+lang+".sh < input.in", timeout=3, shell=True, stdout=PIPE, stderr=PIPE, text=True)
        out = proc.stdout
        err = proc.stderr # エラーメッセージ
        print(out)
    except TimeoutExpired as e:
        print(f"ERROR : {e}")
        err = "ERROR : " + str(e) + "\nMessage : ３秒以内で実行できるコードにしてください。"
        return "",err
    return out,err

def select_lang(lang):
    langFile = ""
    if lang == 'c':
        langFile = "c"
    elif lang == 'cpp':
        langFile = "cpp"
    elif lang == 'shell':
        langFile = "sh"
    elif lang == 'ruby':
        langFile = "rb"
    elif lang == 'haskell':
        langFile = "hs"
    elif lang == 'python':
        langFile = "py"
    elif lang == 'java':
        langFile = "java"
    elif lang == 'go':
        langFile = "go"
    elif lang == 'javascript':
        langFile = "js"
    elif lang == 'php':
        langFile = "php"
    elif lang == 'perl':
        langFile = "pl"
    elif lang == 'brainfuck':
        langFile = "bf"
    elif lang == 'nadesiko3':
        langFile = "nako3"
    elif lang == 'csharp':
        langFile = "cs"
    elif lang == 'wenyan':
        langFile = "wy"
    return langFile

if __name__ == "__main__":
    app.run()