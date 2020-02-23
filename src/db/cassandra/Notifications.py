keyspace_name = 'notifications'
table_name = 'notif'
table_props = '(notif_id text, notif_user text, notif_content map, notif_type text, notif_time timestamp, PRIMARY_KEY(notif_id, notif_user))'

# Queries
create_keyspace_query = "CREATE KEYSPACE IF NOT EXISTS " + keyspace_name + " WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 }"
select_keyspace_query = "USE " + keyspace_name
create_files_table_query = "CREATE TABLE IF NOT EXISTS " + table_name + table_props