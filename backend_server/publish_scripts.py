# publish_scripts.py

import os
import django
import sys
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_server.settings")  
django.setup()

import json
from paho.mqtt.client import Client
import time
from datetime import datetime
from random import uniform
from backend_app.management.mqtt.mqtt_script import MqttConnect
import threading

from backend_app.models import NodeDataModel,PublishTopic,NodeModel
from save_n_data_to_db import SaveNodeDataToDB

# Global variable to signal the script to stop
stop_script = False
stop_lock = threading.Lock()
saveNode = SaveNodeDataToDB()

def stop_publishing():
    global stop_script
    with stop_lock:
        stop_script = True


def publish_data(*topics):
    global stop_script
    mq = MqttConnect()
    mq.topic = topics
    mq._connected = True
    stop_script = False

    try:
        publish_thread = threading.Thread(target=post_data_to_publish, args=(mq,))
        subscribe_thread = threading.Thread(target=data_subscribe, args=(mq,))

        publish_thread.start()
        subscribe_thread.start()

        while True:
            try:
                time.sleep(1)
                with stop_lock:
                    if stop_script == True:
                        mq.on_disconnect(None, None, 1) 
                        break
            except KeyboardInterrupt:
                with stop_lock:
                    stop_script == True
                    mq.on_disconnect(None, None, 1) 
                print("KeyboardInterrupt: Stopping threads gracefully...")
                break

        publish_thread.join()
        subscribe_thread.join()

    except Exception as e:
        print(f"An error occurred: {e}")

def post_data_to_publish(mq):
    mq.connect_to_broker()
    while True:
        with stop_lock:
            if stop_script == True:
                break

        for i in mq.topic:
            try:
                publish_id = PublishTopic.objects.get(publish_id=i)
                if publish_id:
                    node = NodeModel.objects.get(publish_id=publish_id,status=True,is_blocked=False)
                    if node:
                        NodeData = NodeDataModel.objects.filter(NodeId=node.id).first()
                        if NodeData:
                            times = NodeData.time
                            current = NodeData.current
                            voltage = NodeData.voltage
                            rpm = NodeData.rpm
                            mpu = NodeData.mpu
                            times = NodeData.time
                            times = times.strftime('%Y-%m-%d %H:%M:%S')
                            mq.save_data_t_db_and_publish({"dataPoint": times, "paramType": 'current', "paramValue": current, "deviceId": i})
                            mq.save_data_t_db_and_publish({"dataPoint": times, "paramType": 'voltage', "paramValue": voltage, "deviceId": i})
                            mq.save_data_t_db_and_publish({"dataPoint": times, "paramType": 'rpm', "paramValue": rpm, "deviceId": i})
                            mq.save_data_t_db_and_publish({"dataPoint": times, "paramType": 'mpu', "paramValue": mpu, "deviceId": i})
            except Exception as e:
                print(f"Error : {str(e)}")
                continue
        time.sleep(5)


def on_connect(client, userdata, flags, rc):
    print('Connected with result code '+str(rc))


def on_sub_message(client, userdata, message):
    global status
    data = json.loads(message.payload.decode('utf-8'))
    status = data["status"]
    display_id = data["display_id"]
    saveNode.update_publish_status(display_id,status)
    print(f"Received message: {data}")
    print(f"status val: ---{status}")


def data_subscribe(mq):
    mqtt_client = Client()
    mqtt_client.on_connect = on_connect
    mqtt_client.on_message = on_sub_message
    mqtt_client.username_pw_set(mq._username, password=mq._password)
    mqtt_client.connect(mq._mqttBroker, port=mq._port)
    mqtt_client.loop_start()


    try:
        for t in mq.topic:
            mqtt_client.subscribe(t)
    except KeyboardInterrupt:
        print("KeyboardInterrupt: Stopping subscribe thread gracefully...")
        mqtt_client.loop_stop()
        mqtt_client.disconnect()
    except Exception as e:
        print(f"Error:{str(e)}")
        mqtt_client.loop_stop()
        mqtt_client.disconnect()


if __name__ == "__main__":
    topics_to_publish = ['']  
    publish_data(*topics_to_publish)
