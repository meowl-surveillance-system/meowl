from NotificationProducer import send_Notif
import sys, os
sys.path.append(os.path.join((os.path.dirname(os.path.realpath(__file__))), '..','db','cass'))

from src.cluster_services import ClusterServices

from cassandra.cluster import Cluster

cluster_services = ClusterServices(Cluster())
cluster_services.create_keyspace('streams')
cluster_services.set_keyspace('streams')

#create tables
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS blacklist (name text, PRIMARY KEY(name))')
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS users_id (user_id text, email text, username text, password text, sid text, PRIMARY KEY(user_id))')
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS user_cameras (user_id text, camera_id text, PRIMARY KEY (camera_id))')

#insert queries
insert_blacklist = "INSERT INTO blacklist (name) VALUES (%s)"
insert_user = "INSERT INTO users_id (user_id, email, username, password, sid) VALUES (%s, %s, %s, %s, %s)"
insert_cam = "INSERT INTO user_cameras (user_id, camera_id) VALUES (%s, %s)"

name = "michael"
#execute queries
cluster_services.get_session().execute(insert_blacklist, (name,))
cluster_services.get_session().execute(insert_user, ("abc", "meowl.notifications@gmail.com", "Mama", "lel", "idk"))
cluster_services.get_session().execute(insert_cam, ("abc", "123"))
