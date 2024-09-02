from dataclasses import dataclass
from typing import List


@dataclass
class CoreExercise:
    name: str
    equipment: str
    mechanics: str

@dataclass
class Exercise:
    name: str
    category: str
    sets: int
    equipment: str
    preparation: str
    execution: str
    # reps: int


@dataclass
class ExerciseRoutine:
    chestExercises: List[Exercise]
    tricepExercises: List[Exercise]
    sideDeltExercises: List[Exercise]
    rearDeltExercises: List[Exercise]
    frontDeltExercises: List[Exercise]
    backExercises: List[Exercise]
    trapExercises: List[Exercise]
    bicepExercises: List[Exercise]
    forearmExercises: List[Exercise]
    gluteExercises: List[Exercise]
    hipExercises: List[Exercise]
    quadExercises: List[Exercise]
    hamstringExercises: List[Exercise]
    calfExercises: List[Exercise]
    # tibialisExercises: List[Exercise]
