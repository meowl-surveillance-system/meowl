#
# Install opencv and related dependencies

install_opencv() {
  # Update
  sudo apt-get -y update
  
  # Install pip
  sudo apt install python3-pip

  # Install venv
  sudo apt install python3-venv
  
  # Change To Opencv server directory
  cd ../opencv_flask

  # Create new virtual environment
  python3 -m venv venv
  
  # Running the activate script
  source venv/bin/activate
  
  # Install Flask
  pip install Flask

  # Install OpenCV
  pip3 install opencv-python

}
