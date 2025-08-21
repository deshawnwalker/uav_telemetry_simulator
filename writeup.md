# README

 ## UAV Simulator and Mission Control Dashboard

 This project simulates and visualizes a real-time UAV (Unmanned Aerial Vehicle) telemetry system. It consists of a FastAPI backend that generates live flight data (location, altitude, GPS, battery, system status) and a frontend that displays the UAV’s location, mission status, and system health in a military-style dashboard. The system supports WebSocket streaming, mission control commands (like speed, altitude mode, and return-to-home), and a command console that logs all control changes, mimicking a real-world UAV ground control station.

 ## Backend Architecture Overview

 ![Alt text for accessibility](./writeup_images/backend_architecture.png
 )

The backend simulates a UAV telemetry and control system using FastAPI and asynchronous Python modules. It provides a WebSocket interface for streaming real-time data and a REST API for handling mission control commands.

### Core Modules

#### 1. Telemetry Simulator

A background async task (simulate_telemetry) runs on startup and updates the UAV's:

- Latitude & longitude (based on heading and speed)

- Altitude (based on ascent/descent/cruise modes)

- Battery temperature (influenced by flight mode and speed)

- GPS and system status

- Distance to current target or home position

These values are stored in a shared global telemetry_data dictionary.

#### 2. Simulation Logic

To keep the backend modular, UAV behavior is abstracted into logic.py, including:

- Heading-based GPS movement (move_towards_target)

- Smooth altitude changes (update_altitude)

- Distance calculation using the haversine formula

- Contextual battery temperature changes

#### 3. Mission Control

The /command endpoint accepts POST requests containing updates to:

UAV speed (in MPH)

Altitude mode (ASCENT, CRUISE, DESCENT)

Mission mode (ACTIVE, HOME)

Each valid command is passed through controller.py and:

- Updates mission_config

- Adds a timestamped entry to command_log

- Is reflected in the next telemetry update cycle

#### 4. Websocket Broadcast System

Clients connect to /ws/telemetry to receive updates once per second. The backend uses a connection manager (ws.py) to track active clients and broadcast updated telemetry via WebSockets.

This approach enables:

- Low-latency data streaming

- Multi-client viewing

- A responsive dashboard interface