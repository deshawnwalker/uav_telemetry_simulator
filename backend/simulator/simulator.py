import asyncio
import time
import random
from simulator.state import telemetry_data, mission_config
from simulator.logic import move_towards_target, update_altitude, calculate_distance, update_current_battery_temp
from ws import manager

async def simulate_telemetry():
    while True:

        if not mission_config.get("sim_active", False):
            await asyncio.sleep(0.2)
            continue
        
        telemetry_data["timestamp"] = time.time()

        lat = telemetry_data["latitude"]
        lon = telemetry_data["longitude"]

        if mission_config["mode"] == "ACTIVE":
            target_lat = mission_config["target_lat"]
            target_lon = mission_config["target_lon"]
        else:
            target_lat = mission_config["home_lat"]
            target_lon = mission_config["home_lon"]

        speed = mission_config["speed_mph"]
        new_lat, new_lon = move_towards_target(lat, lon, target_lat, target_lon, speed)
        telemetry_data["latitude"] = new_lat
        telemetry_data["longitude"] = new_lon

        telemetry_data["altitude"] = update_altitude(
            telemetry_data["altitude"],
            mission_config["altitude_mode"]
        )

        speed = mission_config["speed_mph"]
        alt_mode = mission_config["altitude_mode"]
        mode = mission_config["mode"]
        
        telemetry_data["battery_temp"] = update_current_battery_temp(
        telemetry_data["battery_temp"],
        speed,
        mission_config["altitude_mode"],
        mission_config["mode"]
)

        if random.random() < 0.009:
            telemetry_data["gps_status"] = "LOST"
        else:
            telemetry_data["gps_status"] = "OK"

        if telemetry_data["battery_temp"] > 110 or telemetry_data["gps_status"] == "LOST":
            telemetry_data["system_status"] = "WARNING"
        else:
            telemetry_data["system_status"] = "NOMINAL"
        
        telemetry_data["speed_mph"] = speed
        telemetry_data["distance_to_target"] = calculate_distance(
            telemetry_data["latitude"], telemetry_data["longitude"],
            target_lat, target_lon
        )

        await manager.broadcast(telemetry_data)
        await asyncio.sleep(1)