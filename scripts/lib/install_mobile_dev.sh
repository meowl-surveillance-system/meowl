PARENT_PATH=$(
  cd "$(dirname "${BASH_SOURCE[0]}")"
  pwd -P
)

# Goes into the Meowl mobile directory and installs npm packages
install_mobile_dev() {
  echo "Installing Meowl App for Mobile..."
  npm install -g expo-cli
  cd ${PARENT_PATH}/../../src/camera/mobile
  npm i
}
