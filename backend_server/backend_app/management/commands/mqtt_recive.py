from backend_app.management.mqtt.mqtt_script import MqttConnect
from paho.mqtt.client import Client
import threading
from django.core.management.base import BaseCommand
import time
import json
from backend_app.models import DeviceModel
from backend_app.serializers import DeviceModelSerializer
from django.utils import timezone

mq = MqttConnect()
topic = ["101"]

class Command(BaseCommand):
    help = """ (HELP Document)  This is the command For run the MQTT subscribe file and receive the data"""

    def handle(self, *args, **options):
        mqtt_client = Client()
        mqtt_client.on_connect = mq.on_connect
        mqtt_client.on_message = on_message
        mqtt_client.username_pw_set(mq._username, mq._password)
        mqtt_client.connect(mq._mqttBroker, port=mq._port)
        mqtt_client.loop_start()

        try:
            while True:
                for i in topic:
                    mqtt_client.subscribe(i)
                time.sleep(1)
        except KeyboardInterrupt:
            print("the MQTT subscription...\nEnded....\nDisconecting.....")
        finally:
            mqtt_client.disconnect()


def on_message(client, userdata, message):
    try:
        payload_str = message.payload.decode("utf-8")
        payload_dict = json.loads(payload_str)
        payload_dict["size"] = (payload_dict["snr"]).__sizeof__()
        if (payload_dict):    
            DeviceModel.save_data(payload_dict)
            print("Message saved to the database.")
        else:
            print("Invalid message format:")

    except Exception as e:
        print("Error processing message:", str(e))
