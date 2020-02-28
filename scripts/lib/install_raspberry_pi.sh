PARENT_PATH=$(
  cd "$(dirname "${BASH_SOURCE[0]}")"
  pwd -P
)

# Installs Python, venv and its requirements on Raspberry Pi
install_raspberry_pi() {
  echo "Installing Raspberry Pi Meowl App..."
  sudo apt-get -y update
  sudo apt-get -y upgrade
  sudo apt-get -y install ffmpeg
  sudo apt-get -y install python3-pip
  sudo apt-get -y install python3-venv
  sudo apt-get -y install stunnel4
  cd ${PARENT_PATH}/../../src/camera/pi
  python3 -m venv venv
  source ./venv/bin/activate
  pip install -r requirements.txt
}
