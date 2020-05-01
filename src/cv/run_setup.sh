#! /bin/bash
# Unzip unknown.rar and put it into the database
# Requires retrieve_model.sh and pip packages to be installed

echo 'Putting unknown dataset to database'
unrar e unknown.rar frame_extractions/
rm unknown.rar
python3 -c "import insert_frame; insert_frame.store_training_data('unknown')"

