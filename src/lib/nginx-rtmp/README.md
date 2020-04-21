# TODO(chc5): Move this to docs
sudo docker build --tag meowl-nginx-rtmp:1.0 . 
sudo docker run --detach --publish 8000:19350 -p 8008:80 -p 8088:443 --name meowl-nginx-rtmp meowl-nginx-rtmp:1.0

sudo docker build --tag meowl-cass:1.0 . 
sudo docker run --detach --publish 9043:9042 --name meowl-cass meowl-cass:1.0

REMEMBER TO SET YOUR IP TO YOUR LOCAL NETWORK IP
sudo docker build --tag meowl-cass-app:1.0 . --build-arg CERT_FILE_ADDRESS=192.168.1.10:8008/meowl_nginx.crt 
sudo docker run --detach --publish 5001:5000 --name meowl-cass-app meowl-cass-app:1.0 --env CASSANDRA_CLUSTER_IPS=192.168.1.10

sudo docker build --tag meowl-web:1.0 .
sudo docker run --detach --publish 8081:8081 --name meowl-web meowl-web:1.0  
