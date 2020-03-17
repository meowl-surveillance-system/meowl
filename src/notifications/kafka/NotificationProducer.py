from kafka import KafkaProducer
import json

class NotificationProducer(object):
    def __init__(self):
        self.producer = KafkaProducer(
            value_serializer=lambda x: json.dumps(x).encode('utf-8'),
            bootstrap_servers=['localhost:9092']
        )
    
    def send_notification(self, json_data):
        result = self.producer.send("notif", key=b'notif', value=json_data)
        print("kafka send result: {}".format(result.get()))

def send_Notif(data):
    notif = NotificationProducer.NotificationProducer()
	notif.send_notification(json.loads(data))