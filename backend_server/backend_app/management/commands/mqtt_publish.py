from django.core.management.base import BaseCommand
from backend_app.management.mqtt.mqtt_script import MqttConnect
import time
from datetime import datetime
from random import uniform
import json
from paho.mqtt.client import Client
import threading

class Command(BaseCommand):
    help = """ (HELP Document) This is the command for running the MQTT Publish File and publishing the data"""
    threads = []

    def add_arguments(self, parser):
        parser.add_argument('topics', nargs='+', type=str)

    def handle(self, *args, **options):
        mq = MqttConnect()
        topics = options['topics']
        # topics = ['308236632424576']
        mq.topic = topics

        stop_event = threading.Event()

        try:
            publish_thread = threading.Thread(target=post_data_to_publish, args=(stop_event, mq))
            subscribe_thread = threading.Thread(target=data_subscribe, args=(stop_event, mq))

            self.threads.extend([publish_thread, subscribe_thread])

            publish_thread.start()
            subscribe_thread.start()

            while True:
                try:
                    time.sleep(1)  # Add a short sleep to reduce CPU usage
                except KeyboardInterrupt:
                    stop_event.set()
                    print("KeyboardInterrupt: Stopping threads gracefully...")
                    break

            publish_thread.join()
            subscribe_thread.join()

        except Exception as e:
            print(f"An error occurred: {e}")



def post_data_to_publish(stop_event, mq):
    while not stop_event.is_set():
        mq.connect_to_broker()
        while True:
            now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            rand_num = uniform(5.0, 10.0)
            rand_num2 = uniform(5.0, 10.0)
            for i in mq.topic:
                mq.data_publish({"dataPoint": now, "paramType": 'Sensor1', "paramValue": rand_num, "deviceId": i})
                mq.data_publish({"dataPoint": now, "paramType": 'Sensor2', "paramValue": rand_num2, "deviceId": i})
            time.sleep(2)
            if stop_event.is_set():
                break


def on_sub_message(client, userdata, message):
    global status
    data = json.loads(message.payload.decode('utf-8'))
    status = data[0]["status"]
    print(f"Received message: {data}")
    print(f"status val: {status}")


def data_subscribe(stop_event, mq):
    mqtt_client = Client()
    mqtt_client.on_connect = mq.on_connect
    mqtt_client.on_message = on_sub_message
    mqtt_client.username_pw_set(mq._username, mq._password)
    mqtt_client.connect(mq._mqttBroker, port=mq._port)
    mqtt_client.loop_start()

    try:
        while not stop_event.is_set():
            time.sleep(1)  # Add a small delay for responsiveness
    except KeyboardInterrupt:
        stop_event.set()
        print("KeyboardInterrupt: Stopping subscribe thread gracefully...")

    mqtt_client.loop_stop()
    mqtt_client.disconnect()
