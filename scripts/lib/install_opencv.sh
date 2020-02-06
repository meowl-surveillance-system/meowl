#
# Install opencv and its dependencies

install_opencv() {
  # Update
  sudo apt-get -y update
  
  # Install pip
  sudo apt install python3-pip
  
  # Install OpenCV
  pip3 install opencv-python
}
