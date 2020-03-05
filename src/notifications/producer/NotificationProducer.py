from kafka import KafkaProducer
import json

class NotificationProducer(object):
    def __init__(self, kafka_brokers):
        self.producer = KafkaProducer(
            value_serializer=lambda v: json.dumps(v).encode('utf-8'),
            bootstrap_servers=kafka_brokers
        )
    
    def send_notification(self, json_data):
        result = self.producer.send("notif", key=b'notif', value=json_data)
        print("kafka send result: {}".format(result.get()))