import pandas as pd
from models import Exercise, ExerciseRoutine
from helpers import determine_equipment
from chest_script import select_chest_exercises
from back_script import select_back_exercises

full_exercises_dataset_file_path = './datasets/gym_exercise_dataset.csv'
df = pd.read_csv(full_exercises_dataset_file_path)



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




def generate_routine(experience_level, split_type, days_in_the_gym, overall_goal, equipment_availability):
    #experience_level, split_type, days_in_the_gym, overall_goal, equipment_availability
    
    # chest_exercises_dataframe = df[df['Target_Muscles'].str.contains('Pectoralis Major Sternal|Pectoralis Major Clavicular', na = False)]
    chest_exercises_dataframe = pd.read_csv('./datasets/chest_exercises_csv.csv')
    # chest_exercises_dataframe.to_csv("./datasets/chest_exercises_csv.csv", sep=',')


    tricep_exercises_dataframe = df[df['Target_Muscles'].str.contains('Triceps Brachii', na = False)]

    side_delt_exercises_dataframe = df[df['Target_Muscles'].str.contains('Lateral Deltoid', na = False)]
    rear_delt_exercises_dataframe = df[df['Target_Muscles'].str.contains('Posterior Deltoid', na = False)]
    front_delt_exercises_dataframe = df[df['Target_Muscles'].str.contains('Anterior Deltoid', na = False)]


    # back_exercises_dataframe = df[df['Target_Muscles'].str.contains('Latissimus Dorsi|Teres Major|Lower Trapezius|Rhomboids', na = False)]
    back_exercises_dataframe = pd.read_csv('./datasets/back_exercises_csv.csv')
    trap_exercises_dataframe = df[df['Target_Muscles'].str.contains('Upper Trapezius|Levator Scapulae|Middle Trapezius', na = False)]
    bicep_exercises_dataframe = df[df['Target_Muscles'].str.contains('Biceps Brachii|Brachialis', na = False)]
    forearm_exercises_dataframe = df[df['Target_Muscles'].str.contains('Brachioradialis|Wrist Flexors|Wrist Extensors', na = False)]


    glute_exercises_dataframe = df[df['Target_Muscles'].str.contains('Gluteus Maximus', na = False)]
    hip_exercises_dataframe = df[df['Target_Muscles'].str.contains('Hip Abductors|Hip Adductors|Hip Flexors', na = False)]
    quad_exercises_dataframe = df[df['Target_Muscles'].str.contains('Quadriceps', na = False)]
    hamstring_exercises_dataframe = df[df['Target_Muscles'].str.contains('Hamstrings', na = False)]
    calf_exercises_dataframe = df[df['Target_Muscles'].str.contains('Gastrocnemius|Soleus', na = False)]



    if (experience_level == "brandNew" or experience_level == "beginner"):
        chest_sets = 16
        tricep_sets = 8
        shoulder_sets = 18
        back_sets = 16
        bicep_sets = 8
        quad_sets = 12
        hamstring_sets = 12
        glute_sets = 8
        calf_sets = 12
        ab_sets = 12

    if (experience_level == "intermediate" or experience_level == "advanced"):
        chest_sets = 20
        tricep_sets = 12
        shoulder_sets = 22
        back_sets = 24
        bicep_sets = 12
        quad_sets = 20
        hamstring_sets = 20
        glute_sets = 12
        calf_sets = 20
        ab_sets = 20

    possible_equipment = determine_equipment(equipment_availability)
    selected_chest_exercises = select_chest_exercises(chest_exercises_dataframe, equipment_availability, possible_equipment, chest_sets)

    selected_back_exercises = select_back_exercises(back_exercises_dataframe, equipment_availability, possible_equipment, back_sets)


    # routine = ExerciseRoutine(chestExercises = chest_exercises, 
    #                           tricepExercises = tricep_exercises,
    #                           sideDeltExercises = side_delt_exercises,
    #                           rearDeltExercises = rear_delt_exercises,
    #                           frontDeltExercises = front_delt_exercises,
    #                           backExercises = back_exercises,
    #                           trapExercises = trap_exercises,
    #                           bicepExercises = bicep_exercises,
    #                           forearmExercises = forearm_exercises,
    #                           gluteExercises = glute_exercises,
    #                           hipExercises = hip_exercises,
    #                           quadExercises = quad_exercises,
    #                           hamstringExercises = hamstring_exercises,
    #                           calfExercises = calf_exercises)
    
    # routine_dict = asdict(routine)
    # return routine_dict
    for exercise in selected_back_exercises:
        print("Final Exercise: " + exercise.name + " || " + exercise.equipment)
 

#equipment_availability options: noWeights, dumbbells, dumbbellsBarbellRack, gym
generate_routine('intermediate', 'ppl', 'three', 'generalHealth', 'gym')

