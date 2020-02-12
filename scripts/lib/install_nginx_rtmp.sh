# Install nginx with RTMP module
#

NGINX_VERSION=1.17.8
NGINX_DIRECTORY="nginx-${NGINX_VERSION}"
NGINX_RTMP_PORT=1935
NGINX_CONF_FILE="
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}

# RTMP configuration
rtmp {
    server {
        listen ${NGINX_RTMP_PORT}; # Listen on standard RTMP port
        chunk_size 4000;

        application show {
            live on;
            # Turn on HLS
            hls on;
            hls_path /mnt/hls/;
            hls_fragment 3;
            hls_playlist_length 60;
            # disable consuming the stream from nginx as rtmp
            deny play all;
        }
    }
}

http {
    sendfile off;
    tcp_nopush on;
    aio off;
    directio 512;
    default_type application/octet-stream;

    server {
        listen 8080;

        location / {
            # Disable cache
            add_header 'Cache-Control' 'no-cache';

            # CORS setup
            add_header 'Access-Control-Allow-Origin' '*' always;
            add_header 'Access-Control-Expose-Headers' 'Content-Length';

            # allow CORS preflight requests
            if (\$request_method = 'OPTIONS') {
                add_header 'Access-Control-Allow-Origin' '*';
                add_header 'Access-Control-Max-Age' 1728000;
                add_header 'Content-Type' 'text/plain charset=UTF-8';
                add_header 'Content-Length' 0;
                return 204;
            }

            types {
                application/dash+xml mpd;
                application/vnd.apple.mpegurl m3u8;
                video/mp2t ts;
            }

            root /mnt/;
        }
    }
}
"
SERVER_KEY_CERT_PATH="/etc/stunnel/meowl"
STUNNEL_SERVER_CONF_FILE="
pid = /run/stunnel-meowl.pid
foreground = yes # remove this for daemon
debug = 5

[meowl-nginx-server]
cert = ${SERVER_KEY_CERT_PATH}.crt
key = ${SERVER_KEY_CERT_PATH}.key
accept = 19350 # change such that it is on same port as rtmp without binding error
connect = localhost:${NGINX_RTMP_PORT}
"
download_rtmp_module() {
  sudo git -C /usr/local/src clone https://github.com/sergey-dryabzhinsky/nginx-rtmp-module.git
}

install_nginx_dependencies() {
  sudo apt install -y build-essential libpcre3 libpcre3-dev libssl-dev zlib1g zlib1g-dev
}

download_extract_nginx() {
  wget -P /tmp http://nginx.org/download/${NGINX_DIRECTORY}.tar.gz
  sudo tar -xf /tmp/${NGINX_DIRECTORY}.tar.gz -C /usr/local/src
}

# Install nginx with RTMP module and dependencies
install_nginx_with_rtmp() {
  download_rtmp_module
  install_nginx_dependencies
  download_extract_nginx
  cd /usr/local/src/${NGINX_DIRECTORY}/
  ./configure --with-http_ssl_module --add-module=../nginx-rtmp-module --with-http_secure_link_module
  make
  sudo make install
  cd -
  echo "${NGINX_CONF_FILE}" | sudo tee /usr/local/nginx/conf/nginx.conf
}

create_server_key_cert() {
  sudo openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout ${SERVER_KEY_CERT_PATH}.key -out ${SERVER_KEY_CERT_PATH}.crt
}

# Install stunnel as a server with a configuration to work with nginx rtmp
install_stunnel_server() {
  sudo apt install stunnel
  create_server_key_cert
  echo "${STUNNEL_SERVER_CONF_FILE}" | sudo tee /etc/stunnel/stunnel.conf
}

install_nginx_rtmp_all() {
  install_nginx_with_rtmp
  install_stunnel_server
}
