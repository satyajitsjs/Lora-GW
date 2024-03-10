# sending_lora_msg.py
import os
import sys
from random import uniform
from LoRaRF import SX127x
import time
from gpiozero import CPUTemperature
from LoraGateDetails import LoraGateWaySending
from datetime import datetime
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad

# Begin LoRa radio and set NSS, reset, busy, IRQ, txen, and rxen pin with connected Raspberry Pi gpio pins
# IRQ pin not used in this example (set to -1). Set txen and rxen pin to -1 if RF module doesn't have one
busId = 0; csId = 0
resetPin = 22; irqPin = -1; txenPin = -1; rxenPin = -1
LoRa = SX127x()
GateWay = LoraGateWaySending()

encryption_key = b'Sixteen_Byte_Key'
cipher = AES.new(encryption_key, AES.MODE_ECB)


frequency = int(GateWay.frequency) * 1000000
bandwidth = GateWay.bandwidth * 1000
payloadLength = GateWay.payload_length
crc = GateWay.crc
codeRate = GateWay.code_rate

print("Begin LoRa radio")
if not LoRa.begin(busId, csId, resetPin, irqPin, txenPin, rxenPin):
    raise Exception("Something wrong, can't begin LoRa radio")

# Set frequency to 433 Mhz
print(f"Set frequency to {int(GateWay.frequency)} Mhz")
LoRa.setFrequency(frequency)

# Set TX power, this function will set PA config with optimal setting for requested TX power
print("Set TX power to +17 dBm")
LoRa.setTxPower(17, LoRa.TX_POWER_PA_BOOST)  # TX power +17 dBm using PA boost pin

# Configure modulation parameter including spreading factor (SF), bandwidth (BW), and coding rate (CR)
# Receiver must have same SF and BW setting with transmitter to be able to receive LoRa packet
print("Set modulation parameters:\n\tSpreading factor = 7\n\tBandwidth = 125 kHz\n\tCoding rate = 4/5")
LoRa.setSpreadingFactor(7)  # LoRa spreading factor: 7
LoRa.setBandwidth(bandwidth)  # Bandwidth: 125 kHz
LoRa.setCodeRate(codeRate)  # Coding rate: 4/5

# Configure packet parameter including header type, preamble length, payload length, and CRC type
# The explicit packet includes header contain CR, number of byte, and CRC type
# Receiver can receive packet with different CR and packet parameters in explicit header mode
print("Set packet parameters:\n\tExplicit header type\n\tPreamble length = 12\n\tPayload Length = 15\n\tCRC on")
LoRa.setHeaderType(LoRa.HEADER_EXPLICIT)  # Explicit header mode
LoRa.setPreambleLength(12)  # Set preamble length to 12
LoRa.setPayloadLength(payloadLength)  # Initialize payloadLength to 15
LoRa.setCrcEnable(True)  # Set CRC enable

# Set syncronize word for public network (0x34)
print("Set syncronize word to 0x34")
LoRa.setSyncWord(0x34)

print("\n-- LoRa Transmitter --\n")

counter = 0
# Transmit message continuously
while True:
    # Generate random float value
    random_float = uniform(20.0, 28.0)
    float_str = str(random_float)

    # Convert float value to bytes
    float_bytes = float_str.encode('utf-8')

    encrypted_payload = cipher.encrypt(pad(float_bytes, AES.block_size))

    message_list = [ord(char) for char in str(encrypted_payload)]
    
    # Transmit message and counter
    LoRa.beginPacket()
    LoRa.write(message_list,len(message_list))
    LoRa.write([counter], 1)
    LoRa.endPacket()
    # Print message and counter
    print(f"{encrypted_payload}  {counter}")
    print(type(encrypted_payload))
    # Wait until the modulation process for transmitting a packet finishes
    LoRa.wait()

    # Print transmit time and data rate
    print("Transmit time: {0:0.2f} ms | Data rate: {1:0.2f} byte/s \n\n".format(LoRa.transmitTime(), LoRa.dataRate()))
    # Don't load the RF module with continuous transmit
    time.sleep(5)
    counter = (counter + 1) % 256
    