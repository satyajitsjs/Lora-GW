import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_server.settings")  
django.setup()


from backend_app.models import NodeModel, NodeDataModel,PublishTopic
import random
from django.utils import timezone

class SaveNodeDataToDB:
    def save_nodeData(self,node_id,snr_value,rssi_value,counter_value,crc_value,current,voltage,rpm,mpu,status):
        node = NodeModel.objects.get(id=node_id,status=True,is_blocked=False)

        data_instance = NodeDataModel(
            NodeId=node,
            time=timezone.now(),
            counter=counter_value,
            s_n_r=snr_value,
            r_s_s_i=rssi_value,
            c_r_c=crc_value,
            current = current,
            voltage = voltage,
            rpm=rpm,
            mpu = mpu,
            node_status=status
        )

        try:
            data_instance.save()
            print(f"Data {counter_value} saved successfully with NodeId {node.id}.")
        except Exception as e:
            print(f"Error saving data {counter_value}: {e}")
            crc_value = False

        if not crc_value:
            data_instance.c_r_c = False
            data_instance.save()
            print(f"CRC failed for data {counter_value}. CRC value updated.")


    def conf_node(self,id):
        try:
            node = NodeModel.objects.get(id=id, is_blocked=False)
            if node.status == False:
                node.status = True
                node.save()
                print("Node is Now Activate")
                return 1
        except NodeModel.DoesNotExist:
            print("Node not available or blocked.")
            return 0
        except Exception as e:
            print("Error:", str(e))
            


    def get_frequency(self,id=None):
        try:
            if id == None:
                node = NodeModel.objects.filter(status=True,is_blocked=False)
                frequency = []
                for n in node:
                    frequency.append(n.frequency)
                return frequency 
            node = NodeModel.objects.get(id=id)
            return(node.frequency)
        except NodeModel.DoesNotExist:
            print("Node not available or blocked.")
            return 0
        except Exception as e:
            print(f"Error : {str(e)}")


    def get_node_by_publish_id(self):
        try:
            node = PublishTopic.objects.all()
            return node
        except PublishTopic.DoesNotExist:
            return "Node Not Available"
        except Exception as e:
            return (str(e))
    
    def update_publish_status(self,publish_id,status):
        try:
            pub = PublishTopic.objects.get(publish_id=publish_id)
            pub.status = status
            pub.save()
            print(pub.status)
        except Exception as e:
            print(f"Error:{str(e)}")

