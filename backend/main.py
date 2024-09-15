import os
from fastapi import FastAPI
import entry
from pydantic import BaseModel
import random

app = FastAPI()

class HeartbeatRequest(BaseModel):
    heartrate: int

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/get_entries")
def get_entries(date: str):
   result = entry.get_entries(date)['result']['data_array']
   entries = []
   for res in result: #date, caption, image_data
        cur = {}
        entries.append(cur)
        cur['date'] = res[0]
        cur['heartrate'] = res[1]
        cur['caption'] = res[2]
        cur['front_camera'] = res[3]
        cur['back_camera'] = res[4]
   return entries

@app.post("/take_heartbeat")
def take_heartbeat(request: HeartbeatRequest):
    entry.start_heartbeat(request.heartrate)
    return {"status": "success"}

@app.post("/record_heartbeat")
def record_heartbeat(date: str, front_camera: str, back_camera: str):
    caption = entry.generate_caption(front_camera, back_camera)
    heartrate = random.random() * 25 + 90
    result = entry.add_entry(date, heartrate, caption, front_camera, back_camera)
    if not result:
        return {"error": "Failed to record heartbeat"}
    return {"caption": caption}

@app.post("/get_insights")
def get_insights(date: str):
    result = entry.get_insights(date)['results']['data_array']
    entries = {}
    for res in result:
        entries['date'] = res[0]
        entries['max_heart_rate'] = res[1]
        entries['total_entries'] = res[2]
    return entries


# To run the app with the correct port on Render
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))  # Use the PORT environment variable provided by Render
    uvicorn.run(app, host="0.0.0.0", port=port)