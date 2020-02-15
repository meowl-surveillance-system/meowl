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

  # Install opencv requirements
  pip install -r requirements.txt
  
}
