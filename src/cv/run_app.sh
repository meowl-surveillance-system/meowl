#!/bin/bash

# Setting language to UTF-8
export LC_ALL=C.UTF-8

export CASSANDRA_CLUSTER_IPS=${CASSANDRA_CLUSTER_IPS:-192.168.1.10}
export CASSANDRA_CLUSTER_PORT=${CASSANDRA_CLUSTER_PORT:-9043}

export AUTH_SERVER_URL=${AUTH_SERVER_URL:-http://192.168.1.10:8081}

export STUNNEL_IP=${STUNNEL_IP:-127.0.0.1}
export STUNNEL_PORT=${STUNNEL_PORT:-1234}

export ADMIN_USERNAME=${ADMIN_USERNAME:-hello}
export ADMIN_PASSWORD=${ADMIN_PASSWORD:-world}

export KAFKA_BROKER_URL=${KAFKA_BROKER_URL:-192.168.1.10:9093}

export FLASK_APP=${FLASK_APP:-${APP_NAME}}

# Run stunnel
sudo stunnel /etc/stunnel/stunnel.conf

# Open the Python virtual environment if it exists
[[ -d "./venv" ]] && source venv/bin/activate

# Run Flask
# Runs on port 9000 by default
flask run --host=0.0.0.0 --port=9000
