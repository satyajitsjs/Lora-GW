import json
import uuid

class ConfData:
    def __init__(self):
        self.gateWayId = self.get_json_data().get("gatewayId", "")
        self.encripted_key = self.get_json_data().get("encripted_key" , "1234567812345678")
        self.conf_frequency = self.get_json_data().get("frequency" , 432.0)

    def get_json_data(self):
        try:
            with open("conf_lora.json", "r") as file:
                data = json.load(file)
                return data
        except Exception as e:
            data = {}
            print(str(e))
            return data
            
    def get_mac_address(self):
        mac = ':'.join(['{:02x}'.format((uuid.getnode() >> elements) & 0xff) for elements in range(0,2*6,2)][::-1])
        return mac
        

class LoraGateWaySending(ConfData):
    def __init__(self):
        super().__init__()
        self.id = self.get_mac_address()
        self.frequency = 432.0
        self.bandwidth = 125
        self.sf = 7
        self.rxGain = 17
        self.code_rate = 5
        self.payload_length = 15
        self.crc = True



class LoraGateWayDownLink(ConfData):
    def __init__(self):
        super().__init__()
        self.id = self.get_mac_address()
        self.frequency = 433
        self.bandwidth = 125
        self.sf = 7
        self.txPower = 17
        self.code_rate = 5
        self.payload_length = 15
        self.crc = True
