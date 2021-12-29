import requests

load_url = "https://codezine.jp/article/detail/12230"
html = requests.get(load_url)

print(html.content)