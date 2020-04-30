#! /bin/bash
echo 'Putting unknown dataset to database'
source main.env
unrar e unknown.rar frame_extractions/
rm unknown.rar
python3 -c "import insert_frame; insert_frame.store_training_data('unknown')"

