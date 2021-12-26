FROM debian:9

RUN apt-get update && apt-get install -y -q sudo 

########################################################################3
# Cの環境構築
RUN sudo apt-get install -y -q gcc
# Javaの環境構築
RUN sudo apt-get install -y -q default-jre
RUN sudo apt install -y -q default-jdk
# goの環境構築
RUN sudo apt-get install -y -q golang-go
# rubyの環境構築
RUN sudo apt-get install -y -q ruby 
# nodeの環境構築
RUN sudo apt-get install -y -q nodejs
# Haskellの環境構築
RUN sudo apt-get install -y -q haskell-platform
# Pythonの環境構築
RUN sudo apt-get install -y -q python3.9
#######################################################################
# pip3コマンドをインストール
RUN sudo apt install -y -q python3-pip

# https://qiita.com/kazuyoshikakihara/items/0cf74c11d273b0064c83
# 文字コード
ENV LANG C.UTF-8
ENV TZ Asia/Tokyo

# uwsgiでPythonのアプリケーションを配置するディレクトリ
# https://qiita.com/11ohina017/items/da2ae5b039257752e558
COPY ./python /var/www

# 作業ディレクトリ
WORKDIR /var/www/
RUN pip3 install --upgrade pip

RUN pip3 install -r requirements.txt

# uwsgiを実行するコマンド
CMD ["uwsgi","--ini","/var/www/uwsgi.ini"]