#
# Web Server Installation Script
#

PARENT_PATH=$(
  cd "$(dirname "${BASH_SOURCE[0]}")"
  pwd -P
)

install_web_server() {

  sudo apt -y update

  sudo apt install -y python3-pip

  sudo apt install -y python3-venv

  cd ${PARENT_PATH}/../../src/web/server/

  python3 -m venv venv

  source venv/bin/activate

  pip install -r -y requirements.txt

}
