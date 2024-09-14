import requests
import json
import os
from dotenv import load_dotenv
import logging

load_dotenv()

url = "https://dbc-d3a357fd-4698.cloud.databricks.com/api/2.0/sql/statements/"
headers = {
  'Authorization': 'Bearer ' + os.getenv('DATABRICKS'),
  'Content-Type': 'text/plain'
}

def add_entry(date, caption, image_data):
    # INSERT INTO heartbeat.default.entries
    # VALUES ('2024-09-14', 'Sample Caption', 'image_data');
    payload = {}
    payload['warehouse_id'] = '360d9dd238bf069f'
    payload['statement'] = f"INSERT INTO heartbeat.default.entries VALUES ('{date}', '{caption}', '{image_data}');"
    payload['wait_timeout'] = '30s'
    response = requests.request("POST", url, headers=headers, data=json.dumps(payload))
    response = requests.request("POST", url, headers=headers, data=payload)
    print(response.text)


def get_entries(date: str):
    # date format: '2024-09-14'
    # Sample: SELECT * FROM heartbeat.default.entries WHERE date == '2024-09-14'
    payload = {}
    payload['warehouse_id'] = '360d9dd238bf069f'
    payload['statement'] = f"SELECT * FROM heartbeat.default.entries WHERE date == '{date}'"
    payload['wait_timeout'] = '30s'
    response = requests.request("POST", url, headers=headers, data=json.dumps(payload))
    return json.loads(response.text)
    
def start_heartbeat(heartrate: int):
    # TODO: send notif 
    logging.debug(f"Received heartrate: {heartrate}")
    pass

if __name__ == '__main__':
  pass
    # add_entry('2024-09-14', 'Sample Caption', 'image_data')
    # get_entries('2024-09-14')