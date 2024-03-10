# LoRa-GateWay
    A LoRa Gateway server with a React app is a comprehensive solution for managing and monitoring LoRaWAN networks. The LoRa Gateway server acts as a central hub, receiving and processing data from LoRa devices and forwarding it to the appropriate applications. It serves as a bridge between the physical LoRa network and the digital realm, ensuring efficient communication.

    Paired with a React app, the user interface becomes intuitive and responsive, allowing users to easily visualize and manage the connected devices. The React app provides a user-friendly dashboard where administrators can monitor network health, track device status, and analyze data in real-time. With its modern and dynamic interface, the React app enhances the user experience, making it seamless to configure settings, troubleshoot connectivity issues, and gain insights into the performance of the LoRaWAN network.

    Together, the LoRa Gateway server and React app form a powerful combination, streamlining the deployment and management of LoRaWAN infrastructure while offering a visually appealing and user-centric experience for administrators.


# Installation

## Setup Backend
```bash
    python3 -m venv envsmart
    source envsmart/bin/activate 
    pip install -r requirement.txt
    cd backend_server
    python3 manage.py runserver 
```

## Setup Frontend using npm
```bash
    cd frontend
    npm install
    npm start
```


# Install NetWork Manager For wifi Details
```bash
    sudo apt-get install network-manager
    sudo systemctl start NetworkManager
    sudo systemctl enable NetworkManager
    sudo systemctl status NetworkManager
    nmcli connection show --active
```


## EnCription and Decription

```bash
    sudo pip install pycryptodome
```

# Deployment

## settings.py
Templates [
    'DIRS':  [os.path.join(BASE_DIR, 'build')],
]

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR , 'static')

STATICFILES_DIRS = [
    os.path.join(BASE_DIR , 'build/static')
]


## urls.py
from django.views.generic import TemplateView
path('',v.index),
path('<path:dummy>', TemplateView.as_view(template_name='index.html')),


--Start--
```bash
    sudo apt update
    sudo apt install python3-venv python3-dev libpq-dev nginx cur
```

--Create envsmart--
```bash
  python3 -m venv envsmart
  source envsmart/bin/activate
```

--install--
```bash
  pip install -r requirement.txt
  pip install -i https://pypi.org/simple/ --extra-index-url https://www.piwheels.org/simple/ -r requirements.txt
  pip install django gunicorn
  deactivate
  sudo pip install -r requirement.txt
  pip install django gunicorn
```

--start gunicorn--
```bash
    python3 manage.py collectstatic
    gunicorn --bind 0.0.0.0:8000 backend_server.wsgi
    sudo nano /etc/systemd/system/gunicorn.socket
```

[Unit]
Description=gunicorn socket

[Socket]
ListenStream=/run/gunicorn.sock

[Install]
WantedBy=sockets.target

--gunicorn service--
```bash
    sudo nano /etc/systemd/system/gunicorn.service
```

[Unit]
Description=gunicorn daemon
Requires=gunicorn.socket
After=network.target

[Service]
User=lora
Group=www-data
WorkingDirectory=/home/lora/Desktop/lora_server
ExecStart=/home/lora/Desktop/lora_server/envsmart/bin/gunicorn \
          --access-logfile /home/lora/Desktop/lora_server/gunicorn_access.logs\
          --error-logfile /home/lora/Desktop/lora_server/gunicorn_error.logs\
          --workers 3 \
          --bind unix:/run/gunicorn.sock \
          backend_server.wsgi:application

[Install]
WantedBy=multi-user.target

--enable gunicorn--
```bash
    sudo systemctl start gunicorn.socket
    sudo systemctl enable gunicorn.socket
    sudo systemctl status gunicorn.socket
```

### output
● gunicorn.socket - gunicorn socket
     Loaded: loaded (/etc/systemd/system/gunicorn.socket; enabled; vendor preset: enabled)
     Active: active (listening) since Sat 2024-02-24 18:26:40 IST; 44s ago
   Triggers: ● gunicorn.service
     Listen: /run/gunicorn.sock (Stream)
      Tasks: 0 (limit: 1595)
        CPU: 0
     CGroup: /system.slice/gunicorn.socket

Feb 24 18:26:40 raspberrypi systemd[1]: Listening on gunicorn socket.


--show file--
```bash
    file /run/gunicorn.sock
```

Output
/run/gunicorn.sock: socket

--show file--
```bash
    sudo journalctl -u gunicorn.socket
    sudo systemctl status gunicorn
    curl --unix-socket /run/gunicorn.sock localhost
    sudo systemctl status gunicorn
    sudo journalctl -u gunicorn
    sudo systemctl daemon-reload
    sudo systemctl restart gunicorn
```

## NgNix
```bash
    sudo nano /etc/nginx/sites-available/backend_server 
```

server {
    listen 80;
    server_name 192.168.0.148;

    location = /favicon.ico { access_log off; log_not_found off; }
    location /static/ {
        root /home/lora/Desktop/lora_server;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/run/gunicorn.sock;
    }
}

--enable ngnix--
```bash
    sudo ln -s /etc/nginx/sites-available/backend_server /etc/nginx/sites-enabled
    sudo nginx -t
    sudo systemctl restart nginx
    sudo ufw delete allow 8000
    sudo ufw allow 'Nginx Full'
```

--if any error--

```bash 
    sudo rm /etc/nginx/sites-enabled/backend_server
    sudo nano /etc/nginx/sites-available/backend_server
    sudo tail -F /var/log/nginx/error.log
``` 

--restart the server --

```bash
    sudo systemctl restart gunicorn
    sudo systemctl daemon-reload
    sudo systemctl restart gunicorn.socket gunicorn.service
    sudo nginx -t && sudo systemctl restart nginx
```