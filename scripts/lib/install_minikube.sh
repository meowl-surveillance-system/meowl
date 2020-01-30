# Kubernetes Installation without a VM
#
# Install Docker and all its dependencies
install_docker() {
  sudo apt update
  sudo apt install apt-transport-https ca-certificates curl software-properties-common
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
  sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
  sudo apt update
  sudo apt install docker-ce
}

# Install Kubernetes and all its dependencies
install_kubernetes() {
  curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
  chmod +x ./kubectl
  sudo mv ./kubectl /usr/local/bin/kubectl
}

# Installs minikube
install_minikube() {
  curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && chmod +x minikube
  sudo mkdir -p /usr/local/bin/
  sudo install minikube /usr/local/bin/
}

command -v kubectl >/dev/null 2>&1 || { install_kubectl; }
command -v docker >/dev/null 2>&1 || { install_docker; }
command -v minikube >/dev/null 2>&1 || { install_minikube; }
