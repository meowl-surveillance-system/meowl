import sys
from kafka import KafkaConsumer
import json
from cassandra.cluster import Cluster
import os

class NotificationConsumer():
    consumer = KafkaConsumer("notif", bootstrap_servers=os.getenv("KAFKA_BROKER"))

    # connect to cassandra cluster
    cluster = Cluster([''])
    session = cluster.connect('')
    # start the loop
    try:
        for message in consumer:
            entry = json.loads(json.loads(message.value))['notif']
            print("User: {} Content: {} Type: {}".format(
                entry['user'],
                entry['content'],
                entry['type']))
            print("Notification: {}".format(entry['notif']))
            print("--------------------------------------------------")
            session.execute(
                """
    INSERT INTO notifications (notif_id, notif_user, notif_content, notif_type, notif_id, notif_time, notif)
    VALUES (%s, %s, %s, %s, now(), %s)
    """,
        (
        entry['id'],
        entry['user'],
        entry['content'],
        entry['type'],
        entry['time'],
        entry['notif']))
    except KeyboardInterrupt:
        sys.exit()