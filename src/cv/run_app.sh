APP_NAME='app'

# Run Opencv Server
source venv/bin/activate
export FLASK_APP=${APP_NAME}
# Runs on port 5000 by default
flask run
