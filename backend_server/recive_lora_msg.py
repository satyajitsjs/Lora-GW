import os, sys
from datetime import datetime
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
from LoRaRF import SX127x
from LoraGateDetails import LoraGateWayDownLink

busId = 0
csId = 0
resetPin = 22
irqPin = -1
txenPin = -1
rxenPin = -1

LoRa = SX127x()
GateWay = LoraGateWayDownLink()

encryption_key = b'Sixteen_Byte_Key'
cipher = AES.new(encryption_key, AES.MODE_ECB)

print("Key:", encryption_key)
print("Cipher object:", cipher)

frequency = int(GateWay.frequency) * 1000000
bandwidth = int(GateWay.bandwidth) * 1000
payloadLength = GateWay.payload_length
crc = GateWay.crc
codeRate = GateWay.code_rate

print("Begin LoRa radio")
if not LoRa.begin(busId, csId, resetPin, irqPin, txenPin, rxenPin):
    raise Exception("Something wrong, can't begin LoRa radio")

# Set frequency to 433 Mhz
print(f"Set frequency to {int(GateWay.frequency)} Mhz")
LoRa.setFrequency(frequency)

# Set RX gain. RX gain option is power saving gain or boosted gain
print("Set RX gain to power-saving gain")
LoRa.setRxGain(LoRa.RX_GAIN_POWER_SAVING, LoRa.RX_GAIN_AUTO)

# Configure modulation parameters
print("Set modulation parameters:\n\tSpreading factor = 7\n\tBandwidth = 125 kHz\n\tCoding rate = 4/5")
LoRa.setSpreadingFactor(7)
LoRa.setBandwidth(bandwidth)
LoRa.setCodeRate(codeRate)

# Configure packet parameters
print("Set packet parameters:\n\tExplicit header type\n\tPreamble length = 12\n\tPayload Length = 15\n\tCRC on")
LoRa.setHeaderType(LoRa.HEADER_EXPLICIT)
LoRa.setPreambleLength(12)
LoRa.setPayloadLength(payloadLength)
LoRa.setCrcEnable(crc)

# Set synchronize word for public network (0x34)
print("Set synchronize word to 0x34")
LoRa.setSyncWord(0x34)

print("\n-- LoRa Receiver --\n")

while True:
    # Request for receiving a new LoRa packet
    LoRa.request()
    # Wait for incoming LoRa packet
    LoRa.wait()

    # Put received packet to message and counter variable
    # read() and available() method must be called after request() or listen() method
    
    message = ""
    
    while LoRa.available() > 1:
        message += chr(LoRa.read())
    counter = LoRa.read()
    
    message = eval(message)
    
    try:
        # Pad the encrypted payload to ensure it's a multiple of the block size
        decrypted_message = unpad(cipher.decrypt(message), AES.block_size)
        received_float = float(decrypted_message.decode('utf-8'))
        print(f"Received Meaage: {received_float} {counter}")
    except ValueError as e:
        print(f"Error decrypting or unpadding: {e}")

    formatted_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print("Formatted time:", formatted_time)

    # Print packet/signal status including RSSI, SNR, and signalRSSI
    print("Packet status: RSSI = {0:0.2f} dBm | SNR = {1:0.2f} dB \n\n".format(LoRa.packetRssi(), LoRa.snr()))

    # Show received status in case CRC or header error occurs
    status = LoRa.status()
    global c_r_c
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
