from fastapi.responses import JSONResponse
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import time
from simulator.state import mission_config, DEFAULT_ALTITUDE_FT, DEFAULT_SPEED_MPH
import asyncio
from pydantic import BaseModel
from typing import Dict

from simulator.simulator import simulate_telemetry
from simulator.state import telemetry_data, mission_config, command_log
from control.controller import handle_command
from models.schemas import CommandInput
from ws import manager

"""
FastAPI Entry Point & API Router: Initializes FastAPI server, 
starts UAV simulation loo ,
and handle WebSocket connections and mission control commands,
"""

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
class LatLng(BaseModel):
    lat: float
    lng: float

class SetCoordinates(BaseModel):
    home_coordinates: LatLng
    target_coordinates: LatLng

@app.post("/set-coordinates")
async def set_coordinates(payload: SetCoordinates):
    # Update mission config
    mission_config["home_lat"] = payload.home_coordinates.lat
    mission_config["home_lon"] = payload.home_coordinates.lng
    mission_config["target_lat"] = payload.target_coordinates.lat
    mission_config["target_lon"] = payload.target_coordinates.lng
    mission_config["start_time"] = time.time()
    mission_config["mode"] = "ACTIVE"

    mission_config["sim_active"] = True
    mission_config["speed_mph"]      = DEFAULT_SPEED_MPH
    mission_config["altitude_mode"]  = "CRUISE"
    telemetry_data["speed_mph"]      = DEFAULT_SPEED_MPH
    telemetry_data["altitude"]       = DEFAULT_ALTITUDE_FT
    telemetry_data["battery_temp"]   = 75.0
    telemetry_data["gps_status"]     = "OK"
    telemetry_data["system_status"]  = "NOMINAL"

    telemetry_data["latitude"] = mission_config["home_lat"]
    telemetry_data["longitude"] = mission_config["home_lon"]

    return {"status": "ok", "message": "Coordinates set. Simulation started."}

@app.post("/end-simulation")
async def end_simulation():

    mission_config["sim_active"] = False
    mission_config["mode"] = "HOME"
    return {"status": "ok", "message": "Simulation ended."}

@app.on_event("startup")
async def startup_event():
    mission_config["start_time"] = time.time()
    asyncio.create_task(simulate_telemetry())

@app.websocket("/ws/telemetry")
async def telemetry_ws(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await asyncio.sleep(60)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.post("/command")
async def command_handler(cmd: CommandInput):
    await handle_command(cmd)
    return {"status":"ok", "message": "Command received"}

@app.get("/mission-config")
async def get_mission_config():
    return JSONResponse(content=mission_config)
