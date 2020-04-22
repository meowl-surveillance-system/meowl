sudo add-apt-repository ppa:graphics-drivers/ppa
sudo apt-get install dkms build-essential

sudo apt-get update
sudo apt-get install nvidia-390

sudo apt-get install freeglut3 freeglut3-dev libxi-dev libxmu-dev

wget http://us.download.nvidia.com/tesla/440.64.00/NVIDIA-Linux-x86_64-440.64.00.run
sudo sh NVIDIA-Linux-x86_64-440.64.00.run
