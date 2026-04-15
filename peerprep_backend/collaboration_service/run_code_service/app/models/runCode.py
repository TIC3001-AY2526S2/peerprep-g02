from pydantic import BaseModel, ConfigDict
from typing import List, Dict

class SetupRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    run_code: Dict[str,str]

class CodeRequest(BaseModel):
    userCode: str
    expected_output: str
    input: str