import sys, os

sys.path.append(os.path.join((os.path.dirname(os.path.realpath(__file__))), '..', 'db','cass'))

from src.cluster_services import ClusterServices
from kafka import KafkaConsumer
from json import loads
from cassandra.cluster import Cluster
from uuid import uuid4

class NotificationConsumer():
    consumer = KafkaConsumer(
        "notif",
        bootstrap_servers=['localhost:9092'],
        auto_offset_reset='earliest',
        value_deserializer=lambda x: loads(x.decode('utf-8'))
    )

    # connect to cassandra cluster
    cluster_services = ClusterServices(Cluster())
    cluster_services.set_keyspace('notif')
    # start the loop
    for msg in consumer:
        msg = msg.value
        #save msg into db
        cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS notification (notif_id text, content text, PRIMARY KEY(notif_id))')
        notif_id = str(uuid4())
        content = "This is a temporary notification"
        insert_query = "INSERT INTO notif (notif_id, content) VALUES (%s, %s);"
        cluster_services.get_session.execute(insert_query, (notif_id, content))
        print(msg)