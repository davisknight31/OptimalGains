import pandas as pd
from models import Exercise, ExerciseRoutine
from helpers import determine_equipment
from chest_script import select_chest_exercises
from back_script import select_back_exercises
from triceps_script import select_tricep_exercises
from biceps_script import select_bicep_exercises
from side_delts_script import select_side_delt_exercises
from front_delts_script import select_front_delt_exercises
from rear_delts_script import select_rear_delt_exercises
from traps_script import select_trap_exercises
from forearms_script import select_forearm_exercises
from quads_script import select_quad_exercises
from hamstrings_script import select_hamstring_exercises
from hips_script import select_hip_exercises
from glutes_script import select_glute_exercises
from calves_script import select_calf_exercises
from abs_script import select_ab_exercises

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

    # rear_delt_exercises_dataframe = df[df['Target_Muscles'].str.contains('Posterior Deltoid', na = False)]
    
    # chest_exercises_dataframe = df[df['Target_Muscles'].str.contains('Pectoralis Major Sternal|Pectoralis Major Clavicular', na = False)]
    chest_exercises_dataframe = pd.read_csv('./datasets/chest_exercises.csv')
    # chest_exercises_dataframe.to_csv("./datasets/chest_exercises_csv.csv", sep=',')
    tricep_exercises_dataframe = pd.read_csv('./datasets/tricep_exercises.csv')
    
    front_delt_exercises_dataframe = pd.read_csv('./datasets/front_delt_exercises.csv')
    side_delt_exercises_dataframe = pd.read_csv('./datasets/side_delt_exercises.csv')
    rear_delt_exercises_dataframe = pd.read_csv('./datasets/rear_delt_exercises.csv')


    # back_exercises_dataframe = df[df['Target_Muscles'].str.contains('Latissimus Dorsi|Teres Major|Lower Trapezius|Rhomboids', na = False)]
    back_exercises_dataframe = pd.read_csv('./datasets/back_exercises.csv')
    trap_exercises_dataframe = pd.read_csv('./datasets/trap_exercises.csv')
    bicep_exercises_dataframe = pd.read_csv('./datasets/bicep_exercises.csv')
    forearm_exercises_dataframe = pd.read_csv('./datasets/forearm_exercises.csv')


    glute_exercises_dataframe = pd.read_csv('./datasets/glute_exercises.csv')
    hip_exercises_dataframe = pd.read_csv('./datasets/hip_exercises.csv')
    quad_exercises_dataframe = pd.read_csv('./datasets/quad_exercises.csv')
    hamstring_exercises_dataframe = pd.read_csv('./datasets/hamstring_exercises.csv')
    calf_exercises_dataframe = pd.read_csv('./datasets/calf_exercises.csv')
    ab_exercises_dataframe = pd.read_csv('./datasets/ab_exercises.csv')



    if (split_type == 'ppl'):
        if (experience_level == "brandNew" or experience_level == "beginner"):
            chest_sets = 16
            tricep_sets = 8
            front_delt_sets = 6
            side_delt_sets = 12
            rear_delt_sets = 6
            back_sets = 16
            trap_sets = 6
            bicep_sets = 8
            forearm_sets = 6
            quad_sets = 12
            hamstring_sets = 12
            #ask to include
            glute_sets = 8
            #Could ask to focus, then add more sets, or just let the user adjust themselves
            calf_sets = 6
            #ask to include
            ab_sets = 12
            #ask to include
            hip_sets = 12

        if (experience_level == "intermediate" or experience_level == "advanced"):
            chest_sets = 20
            tricep_sets = 12
            front_delt_sets = 6
            side_delt_sets = 16
            rear_delt_sets = 6
            back_sets = 24
            trap_sets = 6
            bicep_sets = 12
            forearm_sets = 6
            quad_sets = 18
            hamstring_sets = 18
            #ask to include
            glute_sets = 12
            calf_sets = 6
            #ask to include
            ab_sets = 12
            #ask to include
            hip_sets = 12

    possible_equipment = determine_equipment(equipment_availability)
    selected_chest_exercises = select_chest_exercises(chest_exercises_dataframe, equipment_availability, possible_equipment, chest_sets)
    selected_tricep_exercises = select_tricep_exercises(tricep_exercises_dataframe, equipment_availability, possible_equipment, tricep_sets)
    selected_front_delt_exercises = select_front_delt_exercises(front_delt_exercises_dataframe, equipment_availability, possible_equipment, front_delt_sets)
    selected_side_delt_exercises = select_side_delt_exercises(side_delt_exercises_dataframe, equipment_availability, possible_equipment, side_delt_sets)
    selected_rear_delt_exercises = select_rear_delt_exercises(rear_delt_exercises_dataframe, equipment_availability, possible_equipment, rear_delt_sets)


    selected_back_exercises = select_back_exercises(back_exercises_dataframe, equipment_availability, possible_equipment, back_sets)
    selected_trap_exercises = select_trap_exercises(trap_exercises_dataframe, equipment_availability, possible_equipment, trap_sets)
    selected_bicep_exercises = select_bicep_exercises(bicep_exercises_dataframe, equipment_availability, possible_equipment, bicep_sets)
    selected_forearm_exercises = select_forearm_exercises(forearm_exercises_dataframe, equipment_availability, possible_equipment, forearm_sets)

    
    selected_glute_exercises = select_glute_exercises(glute_exercises_dataframe, equipment_availability, possible_equipment, glute_sets)
    selected_hip_exercises = select_hip_exercises(hip_exercises_dataframe, equipment_availability, possible_equipment, hip_sets)
    selected_quad_exercises = select_quad_exercises(quad_exercises_dataframe, equipment_availability, possible_equipment, quad_sets)
    #Core squat/leg press also works hamstrings, so I will subtract from hamstring sets before getting hamstring exercises. For anyone not super advanced, this is fine.
    #Super advanced may want a hamstring day separated
    #Subtracting 6 per week, i.e. 3 per exercise
    hamstring_sets -= 6
    selected_hamstring_exercises = select_hamstring_exercises(hamstring_exercises_dataframe, equipment_availability, possible_equipment, hamstring_sets)
    selected_calf_exercises = select_calf_exercises(calf_exercises_dataframe, equipment_availability, possible_equipment, calf_sets)
    selected_ab_exercises = select_ab_exercises(ab_exercises_dataframe, equipment_availability, possible_equipment, ab_sets)


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
    for exercise in selected_ab_exercises:
        print("Final Exercise: " + exercise.name + " || " + exercise.equipment + " || " + exercise.category)

    
 

#equipment_availability options: noWeights, dumbbells, dumbbellsBarbellRack, gym
generate_routine('intermediate', 'ppl', 'three', 'generalHealth', 'gym')

