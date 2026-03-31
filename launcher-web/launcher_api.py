import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import os
import sys

app = FastAPI()

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ST_APP_PATH = r"c:\Users\ASUS\OneDrive\Desktop\YogaAi\Yoga_AI\native-python-app"

@app.get("/launch")
async def launch_streamlit():
    try:
        # Command to run Streamlit
        cmd = f'cd /d "{ST_APP_PATH}" && streamlit run brainwave_analyzer.py'
        
        # Start the process in a new terminal window
        if sys.platform == "win32":
            subprocess.Popen(f'start cmd /k "{cmd}"', shell=True)
        else:
            # Fallback for other OS (though user is on Windows)
            subprocess.Popen(["streamlit", "run", "brainwave_analyzer.py"], cwd=ST_APP_PATH)
            
        return {"status": "success", "message": "Streamlit app launching..."}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/status")
async def get_status():
    return {"status": "online"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
