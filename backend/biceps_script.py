import random
from helpers import create_exercise, select_random_exercise, determine_number_of_exercises, drop_exercise_from_dataframe, create_possible_exercises_dataframe   

def get_bodyweight_bicep_exercises(allowed_exercises_dataframe):
    bodyweight_exercises = []
    random_item_curl_entry = allowed_exercises_dataframe.loc[(allowed_exercises_dataframe['Exercise Name'] == 'Curl') & (allowed_exercises_dataframe['Equipment'] == 'Body Weight')]
    random_item_curl = create_exercise(random_item_curl_entry.iloc[0], "Biceps")


    inverted_bicep_rows_entry = allowed_exercises_dataframe.loc[(allowed_exercises_dataframe['Exercise Name'] == 'Inverted Biceps Row') & (allowed_exercises_dataframe['Equipment'] == 'Body Weight')]
    inverted_bicep_rows = create_exercise(inverted_bicep_rows_entry.iloc[0], "Biceps")
    
    bodyweight_exercises.append(random_item_curl)
    bodyweight_exercises.append(inverted_bicep_rows)

    return bodyweight_exercises

def get_biceps_brachii_exercises(allowed_exercises_dataframe):
    biceps_brachii_exercises = []
    biceps_brachii_exercises_dataframe = allowed_exercises_dataframe[allowed_exercises_dataframe['Target_Muscles'].str.contains('Biceps Brachii', na = False)]
    for index, row in biceps_brachii_exercises_dataframe.iterrows():
        created_exercise = create_exercise(row, 'Biceps')
        biceps_brachii_exercises.append(created_exercise)
    return biceps_brachii_exercises

def get_brachialis_exercises(allowed_exercises_dataframe):
    brachialis_exercises = []
    brachialis_exercises_dataframe = allowed_exercises_dataframe[allowed_exercises_dataframe['Target_Muscles'].str.contains('Brachialis', na = False)]
    for index, row in brachialis_exercises_dataframe.iterrows():
        created_exercise = create_exercise(row, 'Biceps')
        brachialis_exercises.append(created_exercise)
    return brachialis_exercises



def select_core_exercises(allowed_exercises_dataframe):
    core_exercises = []

    #group exercises
    biceps_brachii_exercises = get_biceps_brachii_exercises(allowed_exercises_dataframe)
    brachialis_exercises = get_brachialis_exercises(allowed_exercises_dataframe)
    
    random_int = random.randint(0, len(biceps_brachii_exercises) - 1)
    biceps_brachii_exercise = biceps_brachii_exercises[random_int]

    random_int = random.randint(0, len(brachialis_exercises) - 1)
    brachialis_exercise = brachialis_exercises[random_int]

    core_exercises.append(biceps_brachii_exercise)
    core_exercises.append(brachialis_exercise)

    return core_exercises


def determine_remaining_bicep_exercises(allowed_exercises_dataframe, selected_exercises, number_of_exercises):
    for i in range(number_of_exercises):
        if (not allowed_exercises_dataframe.empty):
            random_exercise = select_random_exercise(allowed_exercises_dataframe, selected_exercises, "Biceps" )
            selected_exercises.append(random_exercise)
            allowed_exercises_dataframe = drop_exercise_from_dataframe(allowed_exercises_dataframe, random_exercise)
    return selected_exercises


def select_bicep_exercises(bicep_dataframe, equipment_availability, possible_equipment, sets):
    #bodyweight just give the body weight curls thing
    #dumbbells and barbells group muscle types and pull one for each
    #same for gym ^

    number_of_exercises = determine_number_of_exercises(sets)
    allowed_exercises_dataframe = create_possible_exercises_dataframe(bicep_dataframe, possible_equipment)

    selected_exercises = []

    #get body weight exercises
    bodyweight_exercises = get_bodyweight_bicep_exercises(allowed_exercises_dataframe)

    #drop core exercises from potential exercises dataframe since if we get random, or have weights, we do not want any bodyweight exercises in the dataframe
    for exercise in bodyweight_exercises:
        allowed_exercises_dataframe = drop_exercise_from_dataframe(allowed_exercises_dataframe, exercise)


    #get core exercises
    if(equipment_availability == 'noWeights'):
        core_exercises = bodyweight_exercises
    else:
        core_exercises = select_core_exercises(allowed_exercises_dataframe)
        for exercise in core_exercises:
            allowed_exercises_dataframe = drop_exercise_from_dataframe(allowed_exercises_dataframe, exercise)

    selected_exercises = core_exercises

    #decrements by 2 since always 2 core exercises for triceps
    number_of_exercises -= 2


    if (number_of_exercises > 0):
        selected_exercises = determine_remaining_bicep_exercises(allowed_exercises_dataframe, selected_exercises, number_of_exercises)
    
    return selected_exercises