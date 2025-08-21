from pydantic import BaseModel
from typing import Optional

class CommandInput(BaseModel):
    speed_mph: Optional[float]
    altitude_mode: Optional[str]
    mode: Optional[str]