PARENT_PATH=$(
  cd "$(dirname "${BASH_SOURCE[0]}")"
  pwd -P
)

# Install opencv and related dependencies
install_opencv() {
  echo "Installing Meowl OpenCV App..."
  sudo apt -y update
  sudo apt install -y python3-pip
  sudo apt install -y python3-venv
  cd ${PARENT_PATH}/../../src/cv/
  python3 -m venv venv
  source venv/bin/activate
  pip install -r -y requirements.txt
}
