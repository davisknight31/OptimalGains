import csv
from dataclasses import dataclass, asdict
from typing import List
import pandas as pd
import random
import json

full_exercises_dataset_file_path = './datasets/gym_exercise_dataset.csv'
df = pd.read_csv(full_exercises_dataset_file_path)



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


# Exercise Name,Equipment,Variation,Utility,Mechanics,Force,Preparation,Execution,Target_Muscles,Synergist_Muscles,Stabilizer_Muscles,Antagonist_Muscles,Dynamic_Stabilizer_Muscles,Main_muscle,Difficulty (1-5),Secondary Muscles,parent_id
#Column 1: Exercise Name
#Column 2: Equipment
#Column 3: Variation 
#Column 4: Utility 
#Column 5: Mechanics 
#Column 6: Force 
#Column 7: Preparation 
#Column 8: Execution
#Column 9: Target_Muscles
#Column 10: Synergist_Muscles
#Column 11: Stabilizer_Muscles
#Column 12: Antagonist_Muscles
#Column 13: Dynamic_Stabilizer_Muscles
#Column 14: Main_muscle
#Column 15: Difficulty (1-5)
#Column 16: Secondary Muscles
#Column 17: parent_id

#Muscle Groups:
#Chest
#Triceps
#Shoulders
#Back
#Biceps
#Legs

#More Detailed Breakdown (TARGET muscles): 
#Chest -> Pectoralis Major Sternal
#Triceps -> Triceps Brachii
#Shoulders -> Lateral Deltoid (Side Delt), Posterior Deltoid (Rear Delt), Anterior Deltoid (Front Delt),
#Biceps -> Biceps Brachii (Long Head + Short Head), Brachialis, Brachioradialis,
#Forearms (some overlap with Barchioradialis) -> Wrist Flexors, Wrist Extensors
#Back -> Latissimus Dorsi, Teres Major, Lower Trapezius, Rhomboids, Middle Trapezius,
#Traps -> Upper Trapezius, Levator Scapulae, Middle Trapezius
#DEF OVERLAP IN BACK AND TRAPS, LOOK INTO IT MORE
#Glutes -> Gluteus Maximus
#Hips -> Hip Abductors, Hip Flexors, Hip Adductors
#Quads -> Quadriceps
#Hamstrings -> Hamstrings
#Calves -> Gastrocnemius, Soleus
#Tibs -> Tibialis Anterior

#Default Routine Generation: 3 total compound movements, my priority is (chest,back,legs). Can let user choose priority groups for strength, and if none then randomize it, or
#if they have bodybuilding goals, generate majority isolation

def tempSelectExercises(exercises, category):
    selected_exercises = []
    for i in range(4):
        random_int = random.randint(0, len(exercises) - 1)
        random_exercise = exercises.iloc[random_int]
        exercise = Exercise(name = random_exercise['Exercise Name'], category = category, sets = 3, equipment = random_exercise['Equipment'], preparation = random_exercise['Preparation'], execution = random_exercise['Execution'])
        selected_exercises.append(exercise)
    return selected_exercises


def selectChestExercises(exercises):
    selected_exercises = []
    for i in range(4):
        random_int = random.randint(0, len(exercises) - 1)
        # print(exercises.iloc[random_int]['Exercise Name']) 

# def selectTricepExercises(exercises):

# def selectSideDeltExercises(exercises):

# def selectRearDeltExercises(exercises):

# def selectFrontDeltExercises(exercises):


def generateRoutine(splitType):
    chest_exercises = []
    chest_exercises_dataframe = df[df['Target_Muscles'].str.contains('Pectoralis Major Sternal|Pectoralis Major Clavicular', na = False)]
    tricep_exercises_dataframe = df[df['Target_Muscles'].str.contains('Triceps Brachii', na = False)]

    side_delt_exercises_dataframe = df[df['Target_Muscles'].str.contains('Lateral Deltoid', na = False)]
    rear_delt_exercises_dataframe = df[df['Target_Muscles'].str.contains('Posterior Deltoid', na = False)]
    front_delt_exercises_dataframe = df[df['Target_Muscles'].str.contains('Anterior Deltoid', na = False)]

    back_exercises_dataframe = df[df['Target_Muscles'].str.contains('Latissimus Dorsi|Teres Major|Lower Trapezius|Rhomboids|Middle Trapezius', na = False)]
    trap_exercises_dataframe = df[df['Target_Muscles'].str.contains('Upper Trapezius|Levator Scapulae|Middle Trapezius', na = False)]
    bicep_exercises_dataframe = df[df['Target_Muscles'].str.contains('Biceps Brachii|Brachialis', na = False)]
    forearm_exercises_dataframe = df[df['Target_Muscles'].str.contains('Brachioradialis|Wrist Flexors|Wrist Extensors', na = False)]

    glute_exercises_dataframe = df[df['Target_Muscles'].str.contains('Gluteus Maximus', na = False)]
    hip_exercises_dataframe = df[df['Target_Muscles'].str.contains('Hip Abductors|Hip Adductors|Hip Flexors', na = False)]
    quad_exercises_dataframe = df[df['Target_Muscles'].str.contains('Quadriceps', na = False)]
    hamstring_exercises_dataframe = df[df['Target_Muscles'].str.contains('Hamstrings', na = False)]
    calf_exercises_dataframe = df[df['Target_Muscles'].str.contains('Gastrocnemius|Soleus', na = False)]
    # tibialis_exercises = df[df['Target_Muscles'].str.contains('Tibialis Anterior', na = False)]


    # shoulders = df[df['Target_Muscles'].str.contains('Lateral Deltoid|Posterior Deltoid|Anterior Deltoid', na = False)]

    # print(len(chest_exercises_dataframe))
    # print(chest_exercises_dataframe.iloc[64]['Exercise Name']) 

    # selectChestExercises(chest_exercises_dataframe)
    chest_exercises = tempSelectExercises(chest_exercises_dataframe, 'Chest')
    tricep_exercises = tempSelectExercises(tricep_exercises_dataframe, 'Triceps')

    side_delt_exercises = tempSelectExercises(side_delt_exercises_dataframe, 'Side Delts')
    rear_delt_exercises = tempSelectExercises(rear_delt_exercises_dataframe, 'Rear Delts')
    front_delt_exercises = tempSelectExercises(front_delt_exercises_dataframe, 'Front Delts')

    back_exercises = tempSelectExercises(back_exercises_dataframe, 'Back')
    trap_exercises = tempSelectExercises(trap_exercises_dataframe, 'Traps')
    bicep_exercises = tempSelectExercises(bicep_exercises_dataframe, 'Biceps')
    forearm_exercises = tempSelectExercises(forearm_exercises_dataframe, 'Forearms')

    glute_exercises = tempSelectExercises(glute_exercises_dataframe, 'Glutes')
    hip_exercises = tempSelectExercises(hip_exercises_dataframe, 'Hips')
    quad_exercises = tempSelectExercises(quad_exercises_dataframe, 'Quads')
    hamstring_exercises = tempSelectExercises(hamstring_exercises_dataframe, 'Hamstrings')
    calf_exercises = tempSelectExercises(calf_exercises_dataframe, 'Calves')
    





 
    routine = ExerciseRoutine(chestExercises = chest_exercises, 
                              tricepExercises = tricep_exercises,
                              sideDeltExercises = side_delt_exercises,
                              rearDeltExercises = rear_delt_exercises,
                              frontDeltExercises = front_delt_exercises,
                              backExercises = back_exercises,
                              trapExercises = trap_exercises,
                              bicepExercises = bicep_exercises,
                              forearmExercises = forearm_exercises,
                              gluteExercises = glute_exercises,
                              hipExercises = hip_exercises,
                              quadExercises = quad_exercises,
                              hamstringExercises = hamstring_exercises,
                              calfExercises = calf_exercises)
    
    routine_dict = asdict(routine)
    return routine_dict
 


    # for index, row in chest_exercises_dataframe.iterrows():
    #     formatted_exercise = Exercise(name = str(row['Exercise Name']))
    #     print('Exercise Name: ' + str(row['Exercise Name']) + ' Target Muscles: ' + str(row['Target_Muscles']) + ' Synergist Muscles: ' + str(row['Synergist_Muscles']))


    # quad_exercises = df[df['Target_Muscles'].str.contains('Quadriceps', na = False)]
    # for index, row in quad_exercises.iterrows():
    #     print('Exercise Name: ' + row['Exercise Name'] + ' Target Muscles: ' + row['Target_Muscles'] + ' Synergist Muscles: ' + row['Synergist_Muscles'])

# generateRoutine('ppl')

# df = pd.read_csv(full_exercises_dataset_file_path)

# print(df['Target_Muscles'].to_string(index=False))

# quad_exercises = df[df['Target_Muscles'].str.contains('Quadriceps', na = False)]


# print(quad_exercises['Exercise Name'], quad_exercises['Target_Muscles'], quad_exercises['Synergist_Muscles'])

# for index, row in quad_exercises.iterrows():
#     print('Exercise Name: ' + row['Exercise Name'] + ' Target Muscles: ' + row['Target_Muscles'] + ' Synergist Muscles: ' + row['Synergist_Muscles'])



