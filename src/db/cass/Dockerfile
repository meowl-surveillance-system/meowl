FROM python:3.6

WORKDIR /cass-app

ENV NGINX_RTMP_IP=127.0.0.1

ENV NGINX_RTMP_PORT=19350

ENV CASSANDRA_CLUSTER_IPS="192.168.1.15"

ENV CASSANDRA_CLUSTER_PORT="9043"

ENV CERT_FILE_ADDRESS=192.168.1.15:8008/meowl_nginx.crt

ENV FLASK_APP=/cass-app/app.py

RUN apt-get update

RUN apt-get -y install sudo

RUN sudo apt-get install -y --no-install-recommends apt-utils

RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections 

RUN sudo apt-get -y install wget

COPY . .

RUN ./install

RUN rm -rf ./venv 

RUN pip3 install -r requirements.txt

RUN python3 create_db.py

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]
