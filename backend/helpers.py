from models import Exercise
import pandas as pd
import random


def determine_number_of_exercises(sets):
    #Would break down into 9 sets each workout, or 3-3-3
    if (sets <= 18):
        return 3
    #Would break down into 12 sets each workout, or 3-3-3-3 // 4-4-4
    if (sets <= 24):
        return 4
    #24 is currently most for a muscle group,  but could add for more later. Probably would max it at 5 though.

def determine_equipment(equipment_availability):
    possible_equipment = []

    if (equipment_availability == 'noWeights' ):
        possible_equipment = ['Body Weight']
    if (equipment_availability == 'dumbbells'):
        possible_equipment = ['Body Weight', 'Dumbbell']
    if (equipment_availability == 'dumbbellsBarbellRack'):
        possible_equipment = ['Body Weight', 'Dumbbell', 'Barbell']
    if (equipment_availability == 'gym'):
        possible_equipment = ['Body Weight', 'Dumbbell', 'Barbell', 'Cable', 'Smith', 'Lever \(plate loaded\)', 'Lever \(selectorized\)']
    
    return possible_equipment

def create_possible_exercises_dataframe(all_muscle_group_exercises_dataframe, possible_equipment):
    #loops and places all exercises with the equipment containing an item from possible equipment into a dataframe and returns it
    allowed_exercises_dataframe = pd.DataFrame()
    for item in possible_equipment:
        allowed_exercises_dataframe = pd.concat([allowed_exercises_dataframe, all_muscle_group_exercises_dataframe[all_muscle_group_exercises_dataframe['Equipment'].str.contains(item, na = False)]]) 
    return allowed_exercises_dataframe


def create_exercise(exercise_dataframe_entry, category):
    exercise = Exercise(name = exercise_dataframe_entry['Exercise Name'], category = category, sets = 3, equipment = exercise_dataframe_entry['Equipment'], preparation =exercise_dataframe_entry['Preparation'], execution = exercise_dataframe_entry['Execution'])
    return exercise



def select_random_exercise(exercise_dataframe, current_exercises, category):
    while True:
        random_int = random.randint(0, len(exercise_dataframe) - 1)
        random_exercise = exercise_dataframe.iloc[random_int]
        if len(current_exercises) > 0:
            #could potentially use hashmap to remove for loop
            for exercise in current_exercises:
                if (random_exercise['Exercise Name'] == exercise.name) and (random_exercise['Equipment'] == exercise.equipment):
                    continue
                else:
                    formatted_exercise = create_exercise(random_exercise, category)
                    return formatted_exercise
        else:
            formatted_exercise = create_exercise(random_exercise, category)
            return formatted_exercise
        

def drop_exercise_from_dataframe(allowed_exercises_dataframe, exercise_to_drop):
    updated_dataframe = allowed_exercises_dataframe.drop(allowed_exercises_dataframe[(allowed_exercises_dataframe['Exercise Name'] == exercise_to_drop.name) & (allowed_exercises_dataframe['Equipment'] == exercise_to_drop.equipment)].index)
    return updated_dataframe


def check_for_bodyweight_and_return_exercise(exercise_dataframe, selected_exercises, equipment_availability, category):
    while True:
        random_exercise = select_random_exercise(exercise_dataframe, selected_exercises, category)
        #if the random exercise is a body weight exercise
        if ('Body Weight' in random_exercise.equipment): 
            bodyweight_count = 0
            #count the number of body weight exercises currently in the routine
            for exercise in selected_exercises:
                    if ('Body Weight' in exercise.equipment):
                        bodyweight_count += 1
            #if the equipment availability is only dumbbellss, we want to limit the routine to 2 bodyweight exercises, continue if already at 2
            if (equipment_availability == 'dumbbells' and bodyweight_count >= 2):
                continue
            #else, if the equipment availability is not noweights or dumbbells, and there is already a bodyweight exercise in the routine, continue
            #the noweights check is necessary because we want to make sure noweights get exercises added after 1
            elif ((equipment_availability != 'noWeights' and equipment_availability != 'dumbbells') and bodyweight_count >= 1):
                continue
            #otherwise, return the exercise as is
            else:
                return random_exercise
        #otherwise, just retrun the exercise
        else:
            return random_exercise