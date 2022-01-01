FROM debian

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
ARG PASS="playspassword"
RUN useradd -p ${PASS} -rm -d /home/${USERNAME} -s /bin/bash -g root -G sudo -u 1001 ${USERNAME}
# sudo
RUN groupadd wheel
RUN usermod -aG wheel play
COPY ./conf/sudoers /etc/sudoers
# パーミッション
RUN chmod o-w bin/
RUN chmod o-w boot/
RUN chmod o-w dev/
RUN chmod o-w etc/
RUN chmod o-w home/
RUN chmod o-w lib/
RUN chmod o-w lib64/
RUN chmod o-w media/
RUN chmod o-w mnt/
RUN chmod o-w opt/
RUN chmod o-w proc/
RUN chmod o-w root/
RUN chmod o-w run/
RUN chmod o-w sbin/
RUN chmod o-w srv/
# RUN chmod o-w sys/
RUN chmod o-w tmp/
RUN chmod o-w usr/
RUN chmod o-w var/
## /var
WORKDIR /var
RUN chmod o-w www/
# RUN chmod o-w c.sh
# RUN chmod o-w cpp.sh
# RUN chmod o-w go.sh
# RUN chmod o-w haskell.sh
# RUN chmod o-w java.sh
# RUN chmod o-w javascript.sh
# RUN chmod o-w python.sh
# RUN chmod o-w ruby.sh
# RUN chmod o-w shell.sh
# RUN chmod o-w main.py

# 制限済みuser(play)になる
USER ${USERNAME}
# user(play)の作業ディレクトリ
WORKDIR /var/www/


# uwsgiを実行するコマンド
CMD ["uwsgi","--ini","/var/www/uwsgi.ini"]

#### メモ
# > docker compose build --build-arg PASS=何か
# > docker compose up
# > docker exec -i -t backend_container_play_langs bash 