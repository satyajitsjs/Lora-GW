#!/bin/bash

# Set the path to your virtual environment activation script
VENV_ACTIVATE="/home/lora/Desktop/Lora_GW/envsmart/bin/activate"

# Set the path to your Django manage.py script
MANAGE_PY="/home/lora/Desktop/Lora_GW/backend_server/manage.py"

# Set the path to your Django settings module
export DJANGO_SETTINGS_MODULE=backend_server.settings

# Activate the virtual environment
source "$VENV_ACTIVATE"

# Run the Django development server
python3 "$MANAGE_PY" runserver 0.0.0.0:8000
