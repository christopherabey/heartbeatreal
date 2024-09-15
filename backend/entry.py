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
    payload['statement'] = f"INSERT INTO heartbeat.default.heartbeat VALUES ('{date}', {heartrate}, :caption , '{front_camera}', '{back_camera}');"
    payload['parameters'] =[{'name': 'caption', 'value': caption}]
    payload['wait_timeout'] = '30s'
    response = requests.request("POST", url, headers=headers_db, data=json.dumps(payload))
    print(response.text)
    return True if response.status_code == 200 else False

def get_entries(date: str):
    # date format: '2024-09-14'
    # Sample: SELECT * FROM heartbeat.default.entries WHERE date == '2024-09-14'
    # payload = {}
    # payload['warehouse_id'] = '360d9dd238bf069f'
    # payload['statement'] = f"SELECT * FROM heartbeat.default.heartbeat WHERE date == '{date}'"
    # payload['wait_timeout'] = '30s'
    # response = requests.request("POST", url, headers=headers_db, data=json.dumps(payload))
    response = [
    {
        "date": "9-14-2024",
        "heartrate": 82,
        "caption": "Running late because my sandwich forgot how to swim in the spaghetti ocean.",
        "front_camera": "https://images-ext-1.discordapp.net/external/3H95JdwI31R5KrijsJz6smHiP-Snr7xOkPRw9KCccU8/https/heartbeatreal.s3.us-west-2.amazonaws.com/pictures/1_front.JPG?format=webp&width=840&height=1120",
        "back_camera": "https://heartbeatreal.s3.us-west-2.amazonaws.com/pictures/1_back.JPG"
    },
    {
        "date": "9-14-2024",
        "heartrate": 90,
        "caption": "The moon called, it wants its broccoli back from the penguin's garage sale.",
        "front_camera": "https://images-ext-1.discordapp.net/external/ZNT4WCt97oWHgG856bfdRjXcxQswSiaxdRadEVGu0kY/https/heartbeatreal.s3.us-west-2.amazonaws.com/pictures/2_front.JPG?format=webp&width=450&height=600",
        "back_camera": "https://images-ext-1.discordapp.net/external/8Eg6p2TeWTjKQJs0iFxcWksqjTmdak8JXJunGlf-nkY/https/heartbeatreal.s3.us-west-2.amazonaws.com/pictures/2_back.JPG?format=webp&width=450&height=600"
    },
    {
        "date": "9-14-2024",
        "heartrate": 86,
        "caption": "My shoes are taking a nap, so I’ll be flying the toaster to work today.",
        "front_camera": "https://images-ext-1.discordapp.net/external/R9iOKZM4NF9lzs7Wyj0UHF9v_caLaPPs5XUfjRXCH0Y/https/heartbeatreal.s3.us-west-2.amazonaws.com/pictures/3_front.JPG?format=webp&width=450&height=600",
        "back_camera": "https://images-ext-1.discordapp.net/external/t9fEG8jypkrDtpy673Y7rzskmoM8vVID1TDs9lksqwo/https/heartbeatreal.s3.us-west-2.amazonaws.com/pictures/3_back.JPG?format=webp&width=450&height=600"
    }
    ]

    return response

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
    logging.debug(f"Received heartrate: {heartrate}")
    payload = {}
    payload['heartrate'] = heartrate
    return payload

def generate_caption(front_camera, back_camera):
    caption_generator = llm.CaptionGenerator()
    response = caption_generator.generate_caption(front_camera, back_camera)
    return response

if __name__ == '__main__':
    print(generate_caption('front_camera', 'back_camera'))
  # pass
    # add_entry('2024-09-14', 'Sample Caption', 'image_data')
    # get_entries('2024-09-14')