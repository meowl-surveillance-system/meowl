# Source: https://hub.docker.com/_/cassandra
FROM cassandra:3

# Enable connections to Cassandra
RUN sed -i 's/# JVM_OPTS="$JVM_OPTS -Djava.rmi.server.hostname=<public name>"/JVM_OPTS="$JVM_OPTS -Djava.rmi.server.hostname=127.0.0.1"/' /etc/cassandra/cassandra-env.sh
