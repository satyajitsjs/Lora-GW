#!/bin/bash

# Function to display messages with formatting
message() {
    echo -e "\033[1;32m$1\033[0m"
}

# Install Python (assuming you are using a Debian-based system)
message "Installing Python..."
sudo apt-get update
sudo apt-get install -y python3 python3-pip

# Create and activate virtual environment
message "Creating and activating virtual environment..."
python3 -m venv envsmart
source envsmart/bin/activate

# Install Django and start the server
message "Installing Django and starting the server..."
pip install -r requirement.txt
cd backend_server
python manage.py runserver &

# Open another terminal window for Yarn installation
gnome-terminal --title="Yarn Installation" -- bash -c "
    # Install Node.js 18
    message 'Installing Node.js 18...'
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs

    # Install Yarn
    message 'Installing Yarn...'
    sudo apt-get install -y yarn

    # Install project dependencies using Yarn
    message 'Installing project dependencies with Yarn...'
    yarn install

    # Start Yarn server
    message 'Starting Yarn server...'
    yarn start
"

# Wait for Django server to start before opening Yarn terminal
sleep 5

message "Script execution completed."
