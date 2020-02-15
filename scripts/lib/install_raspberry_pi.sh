PARENT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")"; pwd -P )

# Installs Python, venv and its requirements on Raspberry Pi
install_raspberry_pi(){
  sudo apt-get -y update
  sudo apt-get install python3-pip
  sudo apt-get install python3-venv
  cd ${PARENT_PATH}/../../src/camera/pi
  python3 -m venv venv
  source ./venv/bin/activate
  pip install -r requirements.txt
}
