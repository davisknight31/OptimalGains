import random
from helpers import create_exercise, select_random_exercise, determine_number_of_exercises, drop_exercise_from_dataframe, create_possible_exercises_dataframe

def get_close_grip_pushups_exercises(allowed_exercises_dataframe):
    close_grip_pushups_exercises = []
    close_grip_pushups_exercises_dataframe = allowed_exercises_dataframe[allowed_exercises_dataframe['Exercise Name'].str.contains('Close Grip Push-up', na = False)]
    for index, row in close_grip_pushups_exercises_dataframe.iterrows():
        created_exercise = create_exercise(row, 'Triceps')
        close_grip_pushups_exercises.append(created_exercise)
    return close_grip_pushups_exercises

def get_dip_exercises(allowed_exercises_dataframe):
    dip_exercises = []
    dip_exercises_dataframe = allowed_exercises_dataframe[allowed_exercises_dataframe['Exercise Name'].str.contains('Dip', na = False)]
    for index, row in dip_exercises_dataframe.iterrows():
        created_exercise = create_exercise(row, 'Triceps')
        dip_exercises.append(created_exercise)
    return dip_exercises

def get_extension_exercises(allowed_exercises_dataframe):
    extension_exercises = []
    extension_exercises_dataframe = allowed_exercises_dataframe[allowed_exercises_dataframe['Exercise Name'].str.contains('Extension', na = False)]
    for index, row in extension_exercises_dataframe.iterrows():
        created_exercise = create_exercise(row, 'Triceps')
        extension_exercises.append(created_exercise)
    return extension_exercises

def get_pushdown_exercises(allowed_exercises_dataframe):
    pushdown_exercises = []
    pushdown_exercises_dataframe = allowed_exercises_dataframe[allowed_exercises_dataframe['Exercise Name'].str.contains('Pushdown', na = False)]
    for index, row in pushdown_exercises_dataframe.iterrows():
        created_exercise = create_exercise(row, 'Triceps')
        pushdown_exercises.append(created_exercise)
    return pushdown_exercises


def select_core_exercises(allowed_exercises_dataframe, equipment_availability):
    #All valid extensions into a group, all valid pushups, all valid dips, all valid pushdowns, and get random ones accordingly.
    core_exercises = []
    #group exercises
    close_grip_pushups_exercises = get_close_grip_pushups_exercises(allowed_exercises_dataframe)
    dip_exercises = get_dip_exercises(allowed_exercises_dataframe)
    extension_exercises =  get_extension_exercises(allowed_exercises_dataframe)
    pushdown_exercises = get_pushdown_exercises(allowed_exercises_dataframe)
    
    #if noWeights, get a close grip pushup and dip
    if (equipment_availability == 'noWeights'):
        random_int = random.randint(0, len(close_grip_pushups_exercises) - 1)
        close_grip_pushup_exercise = close_grip_pushups_exercises[random_int]
        random_int = random.randint(0, len(dip_exercises) - 1)
        dip_exercise = dip_exercises[random_int]
        core_exercises.append(close_grip_pushup_exercise)
        core_exercises.append(dip_exercise)
    #if dumbbells or dumbbells + barbell, get a dip and an extension
    elif (equipment_availability == 'dumbbells' or equipment_availability == 'dumbbellsBarbellRack'):
        random_int = random.randint(0, len(dip_exercises) - 1)
        dip_exercise = dip_exercises[random_int]
        random_int = random.randint(0, len(extension_exercises) - 1)
        extension_exercise = extension_exercises[random_int]
        core_exercises.append(dip_exercise)
        core_exercises.append(extension_exercise)
    #if gym, get a pushdown and an extension
    else:
        random_int = random.randint(0, len(extension_exercises) - 1)
        extension_exercise = extension_exercises[random_int]
        random_int = random.randint(0, len(pushdown_exercises) - 1)
        pushdown_exercise = pushdown_exercises[random_int]
        core_exercises.append(extension_exercise)
        core_exercises.append(pushdown_exercise)
    return core_exercises


def determine_remaining_tricep_exercises(allowed_exercises_dataframe, selected_exercises, number_of_exercises):
    for i in range(number_of_exercises):
        random_exercise = select_random_exercise(allowed_exercises_dataframe, selected_exercises, "Triceps" )
        selected_exercises.append(random_exercise)
        allowed_exercises_dataframe = drop_exercise_from_dataframe(allowed_exercises_dataframe, random_exercise)
    return selected_exercises



def select_tricep_exercises(tricep_dataframe, equipment_availability, possible_equipment, sets):
    #one extension one pushdown, as long as access to gym, otherwise it can only be an extension since cables are needed for pushdowns
    #if noweights, bench dips are only available really
    #if dumbbell, dip and extension
    #same for dumbbell and barbell
    number_of_exercises = determine_number_of_exercises(sets)
    allowed_exercises_dataframe = create_possible_exercises_dataframe(tricep_dataframe, possible_equipment)

    selected_exercises = []

    #always sets the core exercises to 2 exercises
    core_exercises = select_core_exercises(allowed_exercises_dataframe, equipment_availability)

    #adds the core exercises to selected
    #just sets them equal since selected exercises is empty
    selected_exercises = core_exercises

    #drops the selected core exercises from the dataframe
    for exercise in core_exercises:
        allowed_exercises_dataframe = drop_exercise_from_dataframe(allowed_exercises_dataframe, exercise)
    
    #decrements by 2 since always 2 core exercises for triceps
    number_of_exercises -= 2

    #if exercises are still needed, get the rest randomly
    if (number_of_exercises <= 0):
        selected_exercises = determine_remaining_tricep_exercises(allowed_exercises_dataframe, selected_exercises, number_of_exercises)
    
    return selected_exercises
