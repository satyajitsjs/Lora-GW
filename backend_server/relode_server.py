# import os
# import django

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_server.settings")  
# django.setup()

# import sys
# import time
# from django.core.management import execute_from_command_line
# from django.utils.autoreload import restart_with_reloader

# def reload_server():
#     manage_py_path = os.path.join(os.path.dirname(__file__), 'path_to_manage_py', 'manage.py')

#     args = ['manage.py', 'runserver', '0.0.0.0:8000']

#     while True:
#         try:
#             execute_from_command_line(args)
#         except KeyboardInterrupt:
#             sys.exit(e)
#         except SystemExit as e:
#             if e.code == restart_with_reloader:
#                 print("Reloading server...")
#                 time.sleep(1) 
#                 continue
#             else:
#                 sys.exit(e)

# if __name__ == "__main__":
#     reload_server()
