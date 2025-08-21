from simulator.state import mission_config, command_log
from models.schemas import CommandInput
from datetime import datetime

async def handle_command(cmd: CommandInput):
    timestamp_str = datetime.now().strftime("%H:%M:%S")

    if cmd.speed_mph is not None:
        mission_config["speed_mph"] = cmd.speed_mph
        
    if cmd.altitude_mode is not None:
        if cmd.altitude_mode.upper() in {"ASCENT", "DESCENT", "CRUISE"}:
            mission_config["altitude_mode"] = cmd.altitude_mode.upper()
        else:
            pass

    if cmd.mode is not None:
        if cmd.mode.upper() in {"ACTIVE", "HOME"}:
            mission_config["mode"] = cmd.mode.upper()
        else:
            pass