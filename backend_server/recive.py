import os
import sys
from datetime import datetime
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
from LoRaRF import SX127x
import time

def switch_frequency(frequency_list):
    for frequency in frequency_list:
        busId = 0
        csId = 0
        resetPin = 22
        irqPin = -1
        txenPin = -1
        rxenPin = -1

        currentdir = os.path.dirname(os.path.realpath(__file__))
        sys.path.append(os.path.dirname(os.path.dirname(currentdir)))

        from LoRaRF import SX127x

        LoRa = SX127x()

        encryption_key = b'Sixteen_Byte_Key'
        cipher = AES.new(encryption_key, AES.MODE_ECB)

        print("Begin LoRa radio")
        if not LoRa.begin(busId, csId, resetPin, irqPin, txenPin, rxenPin):
            raise Exception("Something wrong, can't begin LoRa radio")

        print(f"Set frequency to {frequency / 1000000} MHz")
        LoRa.setFrequency(frequency)

        print("Set RX gain to power saving gain")
        LoRa.setRxGain(LoRa.RX_GAIN_POWER_SAVING, LoRa.RX_GAIN_AUTO)

        print("Set modulation parameters:\n\tSpreading factor = 7\n\tBandwidth = 125 kHz\n\tCoding rate = 4/5")
        LoRa.setSpreadingFactor(7)
        LoRa.setBandwidth(125000)
        LoRa.setCodeRate(5)

        print("Set packet parameters:\n\tExplicit header type\n\tPreamble length = 12\n\tPayload Length = 15\n\tCRC on")
        LoRa.setHeaderType(LoRa.HEADER_EXPLICIT)
        LoRa.setPreambleLength(12)
        LoRa.setPayloadLength(15)
        LoRa.setCrcEnable(True)

        LoRa.setSyncWord(0x34)
        print("\n-- LoRa Receiver --\n")

        time.sleep(1)
        start_time = time.time()

        while True:
            LoRa.request()
            LoRa.wait(10)
            
            time_wait = time.time()-start_time
            if time_wait >= 10:
                print("No data received in 10 seconds. Switching to the next frequency.")
                LoRa.reset()
                time.sleep(1)
                break
            

            message = ""
            while LoRa.available() > 1:
                message += chr(LoRa.read())
            counter = LoRa.read()

            try:
                message = eval(message)
                decrypted_message = unpad(cipher.decrypt(message), AES.block_size)
                received_float = float(decrypted_message.decode('utf-8'))
                print(f"Received Message: {received_float} {counter}")
            except Exception as e:
                print(f"Error decrypting or unpadding: {e}")
                LoRa.reset()
                time.sleep(1)
                break

            formatted_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            print("Formatted time:", formatted_time)
            print("Packet status: RSSI = {0:0.2f} dBm | SNR = {1:0.2f} dB \n\n".format(LoRa.packetRssi(), LoRa.snr()))

            status = LoRa.status()
            c_r_c = True
            if status == LoRa.STATUS_CRC_ERR:
                c_r_c = False
                print("CRC error")
            elif status == LoRa.STATUS_HEADER_ERR:
                c_r_c = False
                print("Packet header error")

            # Uncomment the following lines if you want to save data to the database
            # if c_r_c == False:
            #     save_nodeData(LoRa.snr(), LoRa.packetRssi(), 0.0, counter, c_r_c)
            # else:
            #     save_nodeData(LoRa.snr(), LoRa.packetRssi(), message, counter, c_r_c)

            # Exit the loop to switch to the next frequency
            if message:
                LoRa.reset()
                time.sleep(1)
                break

if __name__ == "__main__":

    frequency_list = [432200000, 432400000]


    while True:
        switch_frequency(frequency_list)
        time.sleep(1)
