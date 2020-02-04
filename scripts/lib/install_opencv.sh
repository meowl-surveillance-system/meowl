#
# Install opencv and its dependencies
OPENCV_VERSION='4.2.0'
OPENCV_CONTRIB='NO'
install_opencv() {
  # Update
  sudo apt-get -y update

  # Install Dependencies
  sudo apt-get install -y build-essential cmake
  sudo apt-get install -y qt5-default libvtk6-dev
  sudo apt-get install -y zlib1g-dev libjpeg-dev libwebp-dev libpng-dev libtiff5-dev libjasper-dev \
                          libopenexr-dev libgdal-dev
  sudo apt-get install -y libdc1394-22-dev libavcodec-dev libavformat-dev libswscale-dev \
                          libtheora-dev libvorbis-dev libxvidcore-dev libx264-dev yasm \
                          libopencore-amrnb-dev libopencore-amrwb-dev libv4l-dev libxine2-dev
  sudo apt-get install -y libtbb-dev libeigen3-dev
  sudo apt-get install -y python-dev  python-tk  pylint  python-numpy  \
                          python3-dev python3-tk pylint3 python3-numpy flake8
  sudo apt-get install -y ant default-jdk
  sudo apt-get install -y doxygen unzip wget

  # Install Library
  wget https://github.com/opencv/opencv/archive/${OPENCV_VERSION}.zip
  unzip ${OPENCV_VERSION}.zip && rm ${OPENCV_VERSION}.zip
  mv opencv-${OPENCV_VERSION} OpenCV

  if [ $OPENCV_CONTRIB = 'YES' ]; then
    wget https://github.com/opencv/opencv_contrib/archive/${OPENCV_VERSION}.zip
    unzip ${OPENCV_VERSION}.zip && rm ${OPENCV_VERSION}.zip
    mv opencv_contrib-${OPENCV_VERSION} opencv_contrib
    mv opencv_contrib OpenCV
  fi

  cd OpenCV && mkdir build && cd build

  if [ $OPENCV_CONTRIB = 'NO' ]; then
  cmake -DWITH_QT=ON -DWITH_OPENGL=ON -DFORCE_VTK=ON -DWITH_TBB=ON -DWITH_GDAL=ON \
        -DWITH_XINE=ON -DENABLE_PRECOMPILED_HEADERS=OFF ..
  fi

  if [ $OPENCV_CONTRIB = 'YES' ]; then
  cmake -DWITH_QT=ON -DWITH_OPENGL=ON -DFORCE_VTK=ON -DWITH_TBB=ON -DWITH_GDAL=ON \
        -DWITH_XINE=ON -DENABLE_PRECOMPILED_HEADERS=OFF \
        -DOPENCV_EXTRA_MODULES_PATH=../opencv_contrib/modules ..
  fi

  make -j8
  sudo make install
  sudo ldconfig
}

command -v opencv > /dev/null 2>&1 || { install_opencv; }
