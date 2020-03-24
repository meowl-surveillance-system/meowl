from time import sleep
from json import dumps
from kafka import KafkaProducer
import os
import settings

if settings.KAFKA_BROKER is None:
    raise Exception("KAFKA_BROKER: not found")
producer = KafkaProducer(bootstrap_servers=[settings.KAFKA_BROKER],
                         linger_ms=10,
                         value_serializer=lambda x:
                         dumps(x).encode('utf-8'))

def send_detections(detections, frame):
    print(type(frame))
    data = {'detections': detections,
            'frame': frame}
    if settings.CV_TOPIC is None:
        raise Exception("CV_TOPIC: not found")
    producer.send(settings.CV_TOPIC, data)
    producer.flush()
