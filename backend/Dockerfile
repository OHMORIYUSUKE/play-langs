FROM debian:11

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
RUN sudo apt-get install -y -q python3
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


## "play" user 追加(フロントからコードを実行するuser)
WORKDIR /

ARG USERNAME="play"
RUN useradd ${USERNAME}
# sudo
RUN groupadd wheel
RUN usermod -aG wheel play
COPY ./conf/sudoers /etc/sudoers

# パーミッション
RUN chmod +t bin/
RUN chmod +t boot/
RUN chmod +t dev/
RUN chmod +t etc/
RUN chmod +t home/
RUN chmod +t lib/
RUN chmod +t lib64/
RUN chmod +t media/
RUN chmod +t mnt/
RUN chmod +t opt/
RUN chmod +t proc/
RUN chmod +t root/
RUN chmod +t run/
RUN chmod +t sbin/
RUN chmod +t srv/
# RUN chmod +t sys/
RUN chmod +t tmp/
RUN chmod +t var/
# RUN chmod o+wrx var/www/
## /var
WORKDIR /var/www
RUN chmod +t c.sh
RUN chmod +t cpp.sh
RUN chmod +t go.sh
RUN chmod +t haskell.sh
RUN chmod +t java.sh
RUN chmod +t javascript.sh
RUN chmod +t python.sh
RUN chmod +t ruby.sh
RUN chmod +t shell.sh
RUN chmod +t main.py
# 権限付与
RUN sudo chmod o+w hello.py
RUN sudo chmod o+w hello.sh
RUN sudo chmod o+w hello.java
RUN sudo chmod o+w hello.c
RUN sudo chmod o+w hello.rb
RUN sudo chmod o+w hello.cpp
RUN sudo chmod o+w hello.hs
RUN sudo chmod o+w hello.js
RUN sudo chmod o+w hello.go
RUN sudo chmod o+w input.in


# uwsgiを実行するコマンド
CMD ["uwsgi","--ini","/var/www/uwsgi.ini"]
# 制限済みuser(play)になる
USER ${USERNAME}
# user(play)の作業ディレクトリ
WORKDIR /var/www/


#### メモ
# > docker compose build --build-arg PASS=何か
# > docker compose up
# > docker exec -i -t backend_container_play_langs bash 