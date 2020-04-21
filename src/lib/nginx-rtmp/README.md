# TODO(chc5): Move this to docs
sudo docker build --tag meowl-nginx-rtmp:1.0 . 
sudo docker run --detach --publish 8000:19350 -p 8008:80 -p 8088:443 --name meowl-nginx-rtmp meowl-nginx-rtmp:1.0

sudo docker build --tag meowl-cass:1.0 . 
sudo docker run --detach --publish 9043:9042 --name meowl-cass meowl-cass:1.0


sudo docker build --tag meowl-cass-app:1.0 . 
sudo docker run --detach --publish 5001:5000 --name meowl-cass-app meowl-cass-app:1.0

sudo docker build --tag meowl-web:1.0 .
sudo docker run --detach --publish 3000:8081 --name meowl-web meowl-web:1.0
