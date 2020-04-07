# Install nginx with RTMP module
#

NGINX_VERSION=1.17.8
NGINX_DIRECTORY="nginx-${NGINX_VERSION}"
NGINX_RTMP_PORT=1935
KEY_PATH="/etc/ssl/private"
CERT_PATH="/etc/ssl/certs"
MEOWL_CA_KEY="${KEY_PATH}/meowl_CA.key"
MEOWL_CA_CERT="${CERT_PATH}/meowl_CA.pem"
STREAMING_SERVER_KEY="${KEY_PATH}/meowl_nginx.key"
STREAMING_SERVER_CERT="${CERT_PATH}/meowl_nginx.crt"
STREAMING_SERVER_IP=127.0.0.1
STREAMING_SERVER_DNS="localhost"
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
            allow publish 127.0.0.1;
            deny publish all;
            on_publish http://localhost/api-https-proxy/auth/rtmpAuthPublishStart;
            on_publish_done http://localhost/api-https-proxy/auth/rtmpAuthPublishStop;
            # Turn on HLS
            hls on;
            hls_path /mnt/hls/;
            hls_fragment 3;
            hls_playlist_length 60;
            # disable consuming the stream from nginx as rtmp
            deny play all;
            push rtmp://localhost:${NGINX_RTMP_PORT}/view;
        }
        application view {
            live on;
            allow publish 127.0.0.1;
            deny publish all;
            on_play http://localhost/api-https-proxy/auth/rtmpAuthPlay;
        }
    }
}

http {
    sendfile off;
    tcp_nopush on;
    aio off;
    directio 512;
    default_type application/octet-stream;

    # HTTPS certificate and key
    ssl_certificate ${STREAMING_SERVER_CERT};
    ssl_certificate_key ${STREAMING_SERVER_KEY};

    server {
        listen 443 ssl;

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

        location =/meowl_nginx.crt {
            alias ${STREAMING_SERVER_CERT};
        }

        location =/meowl_CA.pem {
            alias ${MEOWL_CA_CERT};
        }

    }
    server {
        listen 80;
        server_name localhost;
        location /api-https-proxy {
          allow 127.0.0.1;
          deny all;
          # Strips the api-https-proxy part of
          # the url, but forward the rest.
          rewrite  ^/api-https-proxy/(.*) /\$1 break;
          proxy_pass https://example.com;
        }

        location =/meowl_nginx.crt {
          alias ${STREAMING_SERVER_CERT};
        }

        location =/meowl_CA.pem {
          alias ${MEOWL_CA_CERT};
        }
    }

}
"
MEOWL_SSL_CONF="
[ req ]
default_bits       = 4096
distinguished_name = req_distinguished_name
req_extensions     = req_ext

[ req_distinguished_name ]
countryName                 = Country Name (2 letter code)
countryName_default         = US
stateOrProvinceName         = State or Province Name (full name)
stateOrProvinceName_default = NY
localityName                = Locality Name (eg, city)
organizationName            = Organization Name (eg, company)
organizationName_default    = Meowl-Surveillance-System
commonName                  = Common Name (e.g. server FQDN or YOUR name)

[ req_ext ]
subjectAltName = @alt_names

[alt_names]
# streaming server ip, or any other ip that needs https
IP.1   = ${STREAMING_SERVER_IP}
DNS.1  = ${STREAMING_SERVER_DNS}
"
STUNNEL_SERVER_CONF_FILE="
pid = /run/stunnel-meowl.pid
# remove this for daemon
foreground = yes
debug = 5

[meowl-nginx-server]
cert = ${STREAMING_SERVER_CERT}
key = ${STREAMING_SERVER_KEY}
# change such that it is on same port as rtmp without binding error
accept = 19350
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
  sudo ./configure --with-http_ssl_module --add-module=../nginx-rtmp-module --with-http_secure_link_module
  sudo make
  sudo make install
  cd -
  echo "${NGINX_CONF_FILE}" | sudo tee /usr/local/nginx/conf/nginx.conf
}

create_server_key_certs() {
  sudo openssl rand -writerand ~/.rnd
  echo "${MEOWL_SSL_CONF}" | sudo tee /tmp/meowl_ssl.cnf
  sudo openssl genrsa -des3 -out ${MEOWL_CA_KEY} 2048
  sudo openssl req -x509 -new -nodes -key ${MEOWL_CA_KEY} -sha256 -days 3650 -out ${MEOWL_CA_CERT} -config /tmp/meowl_ssl.cnf
  sudo openssl genrsa -out ${STREAMING_SERVER_KEY} 2048
  sudo openssl req -new -key ${STREAMING_SERVER_KEY} -out /tmp/meowl.csr -config /tmp/meowl_ssl.cnf
  sudo openssl x509 -req -days 3650 -in /tmp/meowl.csr -CA ${MEOWL_CA_CERT} -CAkey ${MEOWL_CA_KEY} -CAcreateserial -out ${STREAMING_SERVER_CERT} -extfile /tmp/meowl_ssl.cnf -extensions req_ext

}

# Install stunnel as a server with a configuration to work with nginx rtmp
install_stunnel_server() {
  sudo apt install -y stunnel4
  create_server_key_certs
  echo "${STUNNEL_SERVER_CONF_FILE}" | sudo tee /etc/stunnel/stunnel.conf
}

install_nginx_rtmp_all() {
  echo "Installing Nginx rtmp..."
  sudo apt update
  install_nginx_with_rtmp
  install_stunnel_server
}
