import sys
from kafka import KafkaConsumer
from json import loads
from cassandra.cluster import Cluster
import os

class NotificationConsumer():
    consumer = KafkaConsumer(
        "notif",
        bootstrap_servers=['localhost:9092'],
        auto_offset_reset='earliest',
        value_deserializer=lambda x: loads(x.decode('utf-8'))
    )

    # connect to cassandra cluster
    cluster = Cluster([''])
    session = cluster.connect('')
    # start the loop
    for msg in consumer:
        msg = msg.value
        #save msg into db
        print(msg)