#
# Install opencv and related dependencies

install_opencv() {
  # Update
  sudo apt-get -y update
 
  # Installing dependencies 
  sudo apt install python3-pip

  sudo apt install python3-venv
  
  cd ../src/cv/

  # Setting up new virtual environment
  python3 -m venv venv
  
  source venv/bin/activate

  pip install -r opencv_requirements.txt
  
  #pip install Flask

  #pip3 install opencv-python

  # Install Pytest
  #pip install -U pytest

  #pip install mock

  #pip install pytest_mock
  
}
