#!/bin/bash
PARENT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")"; pwd -P )

install_raspberry_pi(){
  sudo apt-get -y update
  sudo apt-get install python3-pip
  sudo apt-get install python3-venv
  cd ../../src/camera/pi
  python3 -m venv venv
  pip install -r requirements.txt
}
