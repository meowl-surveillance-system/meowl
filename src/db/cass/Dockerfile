FROM ubuntu:18.04

MAINTAINER chc5

WORKDIR /app

COPY ./src/db/cass /app/src/db/cass

COPY ./scripts /app/scripts

RUN . /app/scripts/install cassandra

RUN cd /app/src/db/cass

SHELL ["/bin/bash", "-c", "source /app/src/db/cass/venv/bin/activate"]

RUN export FLASK_APP=/app/src/db/cass/app.py

RUN flask run

EXPOSE 5000