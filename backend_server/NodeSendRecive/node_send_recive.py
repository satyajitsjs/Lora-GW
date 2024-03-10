import os
import sys
import time
import threading
from random import uniform
from LoRaRF import SX127x
from LoraGateDetails import LoraGateWaySending, LoraGateWayDownLink
import json
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad , unpad
from Crypto.Random import get_random_bytes
from datetime import datetime

node_status = None

class LoRaCommunicationBase:
    def __init__(self):
        self.busId = 0
        self.csId = 0
        self.resetPin = 22
        self.irqPin = -1
        self.txenPin = -1
        self.rxenPin = -1
        self.LoRa = SX127x()
        self.node_staus = None


class LoRaSender(LoRaCommunicationBase):
    def __init__(self, sending_gateway):
        super().__init__()
        self.sending_gateway = sending_gateway
        self.running = False
        self.stoping = False

    def send_messages(self,args=None):
        self.running = True
        frequency = self.sending_gateway.frequency if args == "conf" else float(self.sending_gateway.conf_frequency) 
        bandwidth = self.sending_gateway.bandwidth
        payload_length = self.sending_gateway.payload_length
        crc = self.sending_gateway.crc
        code_rate = self.sending_gateway.code_rate

        encryption_key = str(self.sending_gateway.encripted_key) if self.sending_gateway.encripted_key else get_random_bytes(16)
        encryption_key = encryption_key.encode('utf-8') if self.sending_gateway.encripted_key else get_random_bytes(16)
        cipher = AES.new(encryption_key, AES.MODE_ECB)

        print("Begin LoRa radio")
        if not self.LoRa.begin(self.busId, self.csId, self.resetPin, self.irqPin, self.txenPin, self.rxenPin):
            raise Exception("Something wrong, can't begin LoRa radio")

        print(f"Set frequency to {frequency} Mhz")
        self.LoRa.setFrequency(int(frequency * 1000000))

        print("Set TX power to +17 dBm")
        self.LoRa.setTxPower(17, self.LoRa.TX_POWER_PA_BOOST)

        print(f"Set modulation parameters:\n\tSpreading factor = 7\n\tBandwidth = {bandwidth} kHz\n\tCoding rate = {code_rate}")
        self.LoRa.setSpreadingFactor(7)
        self.LoRa.setBandwidth(bandwidth * 1000)
        self.LoRa.setCodeRate(code_rate)

        print(f"Set packet parameters:\n\tExplicit header type\n\tPreamble length = 12\n\tPayload Length = {payload_length}\n\tCRC {crc}")
        self.LoRa.setHeaderType(self.LoRa.HEADER_EXPLICIT)
        self.LoRa.setPreambleLength(12)
        self.LoRa.setPayloadLength(payload_length)
        self.LoRa.setCrcEnable(crc)

        print("Set syncronize word to 0x34")
        self.LoRa.setSyncWord(0x34)

        print("\n-- LoRa Transmitter --\n")
        
        if args == "conf":
            counter = 1
            while self.running:
                try:
                    message = self.sending_gateway.id
                    send_msg = str(message)
                    message_list = [ord(char) for char in send_msg]

                    self.LoRa.beginPacket()
                    self.LoRa.write(message_list, len(message_list))
                    self.LoRa.write([counter], 1)
                    self.LoRa.endPacket()

                    print(f"{message}  {counter}")
                    print(type(message))

                    self.LoRa.wait()
                    
                    print("Transmit time: {0:0.2f} ms | Data rate: {1:0.2f} byte/s".format(self.LoRa.transmitTime(), self.LoRa.dataRate()))

                    time.sleep(5)
                    if self.stoping:
                        self.running = False
                        self.LoRa.reset()
                        print("Sending Stop")
                        time.sleep(1)
                        break
                    counter += 1
                except Exception as e:
                    print(f"Error : {str(e)}")
                    continue

        counter = 0
        start_time = time.time()
        while self.running:
            try:
                current_time = datetime.now()
                current_minute = current_time.minute
                if current_minute%2 == 0:
                    self.LoRa.reset()
                    time.sleep(1)
                    main("r")
                    print("Call the Recive.....")
                    break
                current = round(uniform(2.3, 2.8), 2)
                voltage = round(uniform(220.0, 230.0), 2)
                rpm = round(uniform(300.0, 310.0), 2)
                mpu = round(uniform(3.3, 3.8), 2)
                global node_status
                status = node_status
                node_id = self.sending_gateway.id
                message = f"{current}/{voltage}/{rpm}/{mpu}/{node_id}/{status}"
                float_bytes = message.encode('utf-8')

                encrypted_payload = cipher.encrypt(pad(float_bytes, AES.block_size))

                message_list = [ord(char) for char in str(encrypted_payload)]
                
                self.LoRa.beginPacket()
                self.LoRa.write(message_list, len(message_list))
                self.LoRa.write([counter], 1)
                self.LoRa.endPacket()

                print(f"Node ID: {node_id}, Message: {encrypted_payload}, Counter: {counter}")

                print(type(message))

                self.LoRa.wait()
                
                print("Transmit time: {0:0.2f} ms | Data rate: {1:0.2f} byte/s".format(self.LoRa.transmitTime(), self.LoRa.dataRate()))

                if time.time() - start_time >= 60 :
                    time.sleep(1)
                    self.LoRa.reset()
                    time.sleep(1)
                    print("Start Lora Reciving.....")
                    main("r")
                    break

                if self.stoping:
                    self.running = False
                    self.LoRa.reset()
                    print("Sending Stop")
                    time.sleep(1)
                    break
                time.sleep(5)
                counter += 1
            except Exception as e:
                if time.time() - start_time >= 60 :
                    time.sleep(1)
                    self.LoRa.reset()
                    time.sleep(1)
                    print("Start Lora Reciving.....")
                    main("r")
                    break
                print(f"Error : {str(e)}")



    def stop(self):
        self.running = False
        self.stoping = True


class LoRaReceiver(LoRaCommunicationBase):
    def __init__(self, receiving_gateway):
        super().__init__()
        self.receiving_gateway = receiving_gateway
        self.running = False
        self.stoping = False


    def receive_messages(self , args=None):
        self.running = True                    
        frequency = self.receiving_gateway.frequency
        bandwidth = self.receiving_gateway.bandwidth
        payload_length = self.receiving_gateway.payload_length
        crc = self.receiving_gateway.crc
        code_rate = self.receiving_gateway.code_rate

        encryption_key = str(self.receiving_gateway.encripted_key) if self.receiving_gateway.encripted_key else get_random_bytes(16)
        encryption_key = encryption_key.encode('utf-8') if self.receiving_gateway.encripted_key else get_random_bytes(16)
        cipher = AES.new(encryption_key, AES.MODE_ECB) 

        print("Begin LoRa radio")
        if not self.LoRa.begin(self.busId, self.csId, self.resetPin, self.irqPin, self.txenPin, self.rxenPin):
            raise Exception("Something wrong, can't begin LoRa radio")

        print(f"Set frequency to {frequency} Mhz")
        self.LoRa.setFrequency(int(frequency * 1000000))

        print("Set RX gain to power saving gain")
        self.LoRa.setRxGain(self.LoRa.RX_GAIN_POWER_SAVING, self.LoRa.RX_GAIN_AUTO)

        print(f"Set modulation parameters:\n\tSpreading factor = 7\n\tBandwidth = {bandwidth} kHz\n\tCoding rate = {code_rate}")
        self.LoRa.setSpreadingFactor(7)
        self.LoRa.setBandwidth(bandwidth * 1000)
        self.LoRa.setCodeRate(code_rate)

        print(f"Set packet parameters:\n\tExplicit header type\n\tPreamble length = 12\n\tPayload Length = {payload_length}\n\tCRC {crc}")
        self.LoRa.setHeaderType(self.LoRa.HEADER_EXPLICIT)
        self.LoRa.setPreambleLength(12)
        self.LoRa.setPayloadLength(payload_length)
        self.LoRa.setCrcEnable(crc)

        print("Set syncronize word to 0x34")
        self.LoRa.setSyncWord(0x34)

        print("\n-- LoRa Receiver --\n")
        
        if args == "conf":
            while self.running:
                try:
                    self.LoRa.request()
                    self.LoRa.wait(20)

                    message = ""
                    while self.LoRa.available() > 1:
                        message += chr(self.LoRa.read())
                    counter = self.LoRa.read()
                    
                    # Update the "gatewayId" field with a new value (assuming 'message' is defined somewhere)
                    if message:
                        split_values = [str(val) for val in message.split('/')]
                        with open("conf_lora.json", "w") as file:
                            json.dump({
                                "gatewayId": split_values[0],
                                "encripted_key": split_values[1],
                                "frequency":split_values[-1]
                            }, file, indent=2)

                    print(f"{message}  {counter}")

                    print("Packet status: RSSI = {0:0.2f} dBm | SNR = {1:0.2f} dB".format(self.LoRa.packetRssi(), self.LoRa.snr()))

                    time.sleep(1)
                    if self.stoping:
                        self.running = False 
                        self.LoRa.reset()
                        print("Recive Stop")
                        time.sleep(1)
                        break
                except Exception as e:
                    print(f"Error : {str(e)}")
                    continue

        start_time = time.time()
        while self.running:
            try:
                current_time = datetime.now()
                current_minute = current_time.minute
                if current_minute%2 != 0:
                    self.LoRa.reset()
                    time.sleep(1)
                    main("s")
                    print("Call the Recive.....")
                    break
                if time.time() - start_time >= 60 :
                    time.sleep(1)
                    self.LoRa.reset()
                    time.sleep(1)
                    print("Start Lora Sending.....")
                    main("s")
                    break
                self.LoRa.request()
                self.LoRa.wait(20)

                message = ""
                while self.LoRa.available() > 1:
                    message += chr(self.LoRa.read())
                counter = self.LoRa.read()

                message = eval(message)

                decrypted_message = unpad(cipher.decrypt(message), AES.block_size)
                received_float = decrypted_message.decode('utf-8')
                split_values = [val for val in received_float.split('/')]

                node_id = split_values[0]
                new_status = split_values[1]
                if node_id == self.receiving_gateway.id:
                    global node_status
                    node_status = new_status
                    print(f"---{node_status}")
                    print("Packet status: RSSI = {0:0.2f} dBm | SNR = {1:0.2f} dB \n".format(self.LoRa.packetRssi(), self.LoRa.snr()))

                    status = self.LoRa.status()
                    global c_r_c
                    c_r_c = True
                    if status == self.LoRa.STATUS_CRC_ERR : c_r_c = False ; print("CRC error")
                    elif status == self.LoRa.STATUS_HEADER_ERR : c_r_c = False ;  print("Packet header error")
                
                    if self.stoping:
                        self.running = False 
                        self.LoRa.reset()
                        print("Recive Stop")
                        time.sleep(1)
                        break
            except Exception as e:
                print(f"Error : {str(e)}")
                if time.time() - start_time >= 60 :
                    time.sleep(1)
                    self.LoRa.reset()
                    time.sleep(1)
                    print("Start Lora Sending.....")
                    main("s")
                    break
                continue

    


    def stop(self):
        self.running = False
        self.stoping = True




def main(initial_key="s"):
    sending_gateway = LoraGateWaySending()
    receiving_gateway = LoraGateWayDownLink()

    receiver_thread = None
    sender_thread = None
    time_r = None

    key = initial_key
    while True:
        if key == 'c':
            # Stop all running functions
            if receiver_thread and receiver_thread.is_alive():
                receiver.stop()
                receiver_thread.join()  # Wait for receiver thread to finish
            if sender_thread and sender_thread.is_alive():
                sender.stop()
                sender_thread.join()  # Wait for sender thread to finish
            if time_r and time_r.is_alive():
                time_r.cancle()
                sender.stop()


            # Start sending for 10 seconds
            new_sender = LoRaSender(sending_gateway)
            new_sender_thread = threading.Thread(target=new_sender.send_messages,args=("conf",))
            new_sender_thread.start()
            timer_send = threading.Timer(20, new_sender.stop)
            timer_send.start()
            new_sender_thread.join()

            # Start receiving for 10 seconds
            new_receiver = LoRaReceiver(receiving_gateway)
            new_receiver_thread = threading.Thread(target=new_receiver.receive_messages,args=("conf",))
            new_receiver_thread.start()
            timer_receive = threading.Timer(20, new_receiver.stop)
            timer_receive.start()
            new_receiver_thread.join()
            
            time.sleep(2)
            new_receiver.stop()
            new_sender.stop()


            # Schedule 'r' key after 20 seconds
            print("Configuration SuccessFull")
            timer_r = threading.Timer(5, lambda: main('s'))
            timer_r.start()

        elif key == 's':
            if receiver_thread and receiver_thread.is_alive():
                receiver.stop()
            if sender_thread and sender_thread.is_alive():
                sender.stop()
                sender_thread.join()  # Wait for sender thread to finish
            sender = LoRaSender(sending_gateway)
            sender_thread = threading.Thread(target=sender.send_messages)
            sender_thread.start()

        elif key == 'r':
            if sender_thread and sender_thread.is_alive():
                sender.stop()
            if receiver_thread and receiver_thread.is_alive():
                receiver.stop()
                receiver_thread.join()  # Wait for receiver thread to finish
            receiver = LoRaReceiver(receiving_gateway)
            receiver_thread = threading.Thread(target=receiver.receive_messages)
            receiver_thread.start()

        key = input("Press 's' to send messages, 'r' to receive, 'c' to alternate between receiving and sending: \n")


if __name__ == "__main__":
    main()



