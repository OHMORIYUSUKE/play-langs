from urllib import request

for i in range(2):
    response = request.urlopen('https://zenn.dev/u_tan/articles/f351dc7e84e6f3')
    content = response.read()
    response.close()
    html = content.decode()
    title = html.split('<title>')[1].split('</title>')[0]
    print(title)