import requests
import json
import os
import llm
from dotenv import load_dotenv
import logging

load_dotenv()

url = "https://dbc-d3a357fd-4698.cloud.databricks.com/api/2.0/sql/statements/"
headers_db = {
  'Authorization': 'Bearer ' + os.getenv('DATABRICKS'),
  'Content-Type': 'text/plain'
}

def add_entry(date, heartrate, caption, front_camera, back_camera):
    # INSERT INTO heartbeat.default.entries
    # VALUES ('2024-09-14', 'Sample Caption', 'front_camera', 'back_camera');
    payload = {}
    payload['warehouse_id'] = '360d9dd238bf069f'
    payload['statement'] = f"INSERT INTO heartbeat.default.heartbeat VALUES ('{date}', {heartrate}, '{caption}', '{front_camera}, {back_camera}');"
    payload['wait_timeout'] = '30s'
    response = requests.request("POST", url, headers=headers_db, data=json.dumps(payload))
    return True if response.status_code == 200 else False

def get_entries(date: str):
    # date format: '2024-09-14'
    # Sample: SELECT * FROM heartbeat.default.entries WHERE date == '2024-09-14'
    payload = {}
    payload['warehouse_id'] = '360d9dd238bf069f'
    payload['statement'] = f"SELECT * FROM heartbeat.default.entries WHERE date == '{date}'"
    payload['wait_timeout'] = '30s'
    response = requests.request("POST", url, headers=headers_db, data=json.dumps(payload))
    return json.loads(response.text)

def get_insights(date: str):
    # date format: '2024-09-14'
    # Sample: SELECT * FROM heartbeat.default.daily_insights WHERE date == '2024-09-14'
    payload = {}
    payload['warehouse_id'] = '360d9dd238bf069f'
    payload['statement'] = f"SELECT * FROM heartbeat.default.daily_insights WHERE date == '{date}'"
    payload['wait_timeout'] = '30s'
    response = requests.request("POST", url, headers=headers_db, data=json.dumps(payload))
    return json.loads(response.text)
    
def start_heartbeat(heartrate: int):
    # TODO: send notif 
    logging.debug(f"Received heartrate: {heartrate}")
    pass

def generate_caption(front_camera, back_camera):
    caption_generator = llm.CaptionGenerator()
    response = caption_generator.generate_caption(front_camera, back_camera)
    return response

if __name__ == '__main__':
    print(generate_caption('front_camera', 'back_camera'))
  # pass
    # add_entry('2024-09-14', 'Sample Caption', 'image_data')
    # get_entries('2024-09-14')