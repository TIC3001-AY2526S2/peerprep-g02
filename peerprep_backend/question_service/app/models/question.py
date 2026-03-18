from pydantic import BaseModel, ConfigDict
from typing import List, Literal

class Question(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str
    description: str
    categories: List[str]
    complexity: Literal["Easy", "Medium", "Hard"]