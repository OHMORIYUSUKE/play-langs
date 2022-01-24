import code
import subprocess
from subprocess import PIPE,TimeoutExpired
import asyncio

class PlayLangClass:

    def __init__(self, code, input, lang):
        self.code = code
        self.input = input
        self.lang = lang
        self.dir_name = 'PlayLang/'

    def main(self):
        loop = asyncio.get_event_loop()
        loop.create_task(self.write_code(self.code,self.lang,self.input))
        result = loop.run_until_complete(self.run_code(self.lang))
        return result

    async def write_code(self, code,lang,input):
        langFile = self.select_lang(lang)
        ## コードをファイルに書き込む
        text_file = open(self.dir_name+"hello."+langFile, "wt")
        text_file.write(code)
        ## inputを与える
        text_file = open(self.dir_name+"input.in", "wt")
        text_file.write(input)
    
    async def run_code(self, lang):
        try:
            proc = subprocess.run("cd "+self.dir_name+" && sh "+lang+".sh < input.in", timeout=3, shell=True, stdout=PIPE, stderr=PIPE, text=True)
            out = proc.stdout
            err = proc.stderr # エラーメッセージ
        except TimeoutExpired as e:
            print(f"ERROR : {e}")
            err = "ERROR : " + str(e) + "\nMessage : ３秒以内で実行できるコードにしてください。"
            out = ''
        return {'out': out,'err': err}

    def select_lang(self, lang):
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