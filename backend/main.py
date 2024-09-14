import os
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

# To run the app with the correct port on Render
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))  # Use the PORT environment variable provided by Render
    uvicorn.run(app, host="0.0.0.0", port=port)
