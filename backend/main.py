from typing import Union

from fastapi import FastAPI
import entry

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/get_entries")
def get_entries(date: str):
   entry.get_entries(date)
   return {"status": "success"}

@app.post("/take_heartbeat")
def take_heartbeat(heartrate: int):
    entry.start_heartbeat(heartrate)
    return {"status": "success"}