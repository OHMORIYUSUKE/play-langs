FROM nginx:1.21.1

# buildした静的ファイルをnginxの公開するディレクトリにコピー
COPY ./my-app/build /var/www
#COPY ./test /var/www
# ローカルのnginxの設定ファイルをnginxのコンテナに反映
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# TimeZoneをAsia/Tokyoに設定する
ENV TZ Asia/Tokyo
RUN echo "${TZ}" > /etc/timezone \
   && dpkg-reconfigure -f noninteractive tzdata