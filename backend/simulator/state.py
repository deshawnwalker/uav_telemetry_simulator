import time
from typing import Dict, List

DEFAULT_SPEED_MPH = 40.0
DEFAULT_ALTITUDE_FT = 300.0
#initial telemtry state
telemetry_data: Dict = {
    "timestamp": time.time(),
    "altitude": 300.0, #feet
    "battery_temp": 75.0, #fahrenheit
    "gps_status": "OK",
    "system_status": "NOMINAL",
    "latitude": 33.6846,
    "longitude": -117.8265,
    "speed_mph": 15.0, #miles per hour
    "distance_to_target": 0.0 #miles
}

#mission configuration
mission_config: Dict = {
    "speed_mph": 15.0,
    "altitude_mode": "CRUISE",
    "mode": "ACTIVE",
    "target_lat": 40.7484,
    "target_lon": 73.9857,
    "home_lat": 33.6846,
    "home_lon": -117.8265,
    "start_time": None,
    "sim_active": False,
}

command_log: List[str] = []