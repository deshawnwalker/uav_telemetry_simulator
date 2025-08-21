import math
from typing import Tuple
import random
EARTH_RADIUS_M = 6371000

#return new lat/lon based on current location, target, and speed
def move_towards_target(
    lat1: float, lon1: float,
    lat2: float, lon2: float,
    speed_mph: float
) -> Tuple[float, float]:
    speed_mps = speed_mph * 0.44704
    delta = speed_mps / EARTH_RADIUS_M

    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)

    d_lon = lon2_rad - lon1_rad
    d_lat = lat2_rad - lat1_rad

 
    distance = 2 * EARTH_RADIUS_M * math.asin(
        math.sqrt(math.sin(d_lat / 2) ** 2 +
                  math.cos(lat1_rad) * math.cos(lat2_rad) *
                  math.sin(d_lon / 2) ** 2)
    )

    if distance < 1.0:
        return lat2, lon2  # Arrived

    bearing = math.atan2(
        math.sin(d_lon) * math.cos(lat2_rad),
        math.cos(lat1_rad) * math.sin(lat2_rad) -
        math.sin(lat1_rad) * math.cos(lat2_rad) * math.cos(d_lon)
    )

    new_lat_rad = math.asin(
        math.sin(lat1_rad) * math.cos(delta) +
        math.cos(lat1_rad) * math.sin(delta) * math.cos(bearing)
    )

    new_lon_rad = lon1_rad + math.atan2(
        math.sin(bearing) * math.sin(delta) * math.cos(lat1_rad),
        math.cos(delta) - math.sin(lat1_rad) * math.sin(new_lat_rad)
    )

    return math.degrees(new_lat_rad), math.degrees(new_lon_rad)


def update_altitude(current_alt: float, mode: str) -> float:
    """
    Simulates climb, descent, or cruise.
    """
    if mode == "ASCENT":
        return min(current_alt + 1.2, 1000.0)  # limit climb to 1000 ft
    elif mode == "DESCENT":
        return max(current_alt - 1.5, 100.0)   # bottom out at 100 ft
    elif mode == "CRUISE":
         return current_alt + random.uniform(-0.1, 0.1)
    return current_alt


def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Returns distance in miles using haversine formula.
    """
    R = 6371.0  # Earth radius in km

    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)

    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad

    a = math.sin(dlat / 2) ** 2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    distance_km = R * c
    return distance_km * 0.621371

def update_current_battery_temp(
    current_temp: float,
    speed: float,
    altitude_mode: str,
    mission_mode: str
) -> float:
        heating_rate = 0.0001 * speed

        if altitude_mode == "ASCENT":
            heating_rate += 0.004
        elif altitude_mode == "DESCENT":
            heating_rate -= 0.0015
        elif altitude_mode == "CRUISE":
            heating_rate += random.uniform(-0.002,0.002)

        if mission_mode == "HOME" and altitude_mode == "DESCENT":
            heating_rate -= 0.002

        new_temp = current_temp + heating_rate

        # Clamp to realistic min/max range
        return max(50.0, min(new_temp,125.0))