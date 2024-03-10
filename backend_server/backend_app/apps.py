# backend_app/apps.py

from django.apps import AppConfig
# from subprocess import call
# import sys
# import logging

class BackendAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend_app'

    # def ready(self):
    #     try:
    #         call(["python3", "recive_lora_msg.py"])
    #     except KeyboardInterrupt:
    #         sys.exit("Execution manually interrupted.")
    #     except Exception as e:
    #         logging.error(f"Error executing command: {str(e)}")