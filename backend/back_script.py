import random
from helpers import create_exercise, select_random_exercise, determine_number_of_exercises, drop_exercise_from_dataframe, check_for_bodyweight_and_return_exercise, create_possible_exercises_dataframe

def get_core_exercises(back_dataframe, equipment_availability):
    core_exercises = []

    bodyweight_pullups_entry = back_dataframe.loc[(back_dataframe['Exercise Name'] == 'Pull-up') & (back_dataframe['Equipment'] == 'Body Weight') & (back_dataframe['Mechanics'] == 'Compound')]
    bodyweight_pullups = create_exercise(bodyweight_pullups_entry.iloc[0], 'Back')
    core_exercises.append(bodyweight_pullups)


    if (equipment_availability == 'noWeights'):
        return core_exercises

    #always adds dumbbell compounds to core exercises since there is a check later for what to do if no equipment
    bent_over_dumbbell_row_entry = back_dataframe.loc[(back_dataframe['Exercise Name'] == 'Bent-over Row') & (back_dataframe['Equipment'] == 'Dumbbell') & (back_dataframe['Mechanics'] == 'Compound')]
    bent_over_dumbbell_row = create_exercise(bent_over_dumbbell_row_entry.iloc[0], 'Back')
    core_exercises.append(bent_over_dumbbell_row)

    #if anything higher than dumbbells then add barbell movements to core
    #since there is a check later for noWeights it is unncessary to check for that
    if (equipment_availability != 'dumbbells'):
        bent_over_barbell_row_entry = back_dataframe.loc[(back_dataframe['Exercise Name'] == 'Bent-over Row') & (back_dataframe['Equipment'] == 'Barbell') & (back_dataframe['Mechanics'] == 'Compound')]
        #This is fine to be cable or lever, def need to rework the csvs
        pulldown_entry = back_dataframe.loc[(back_dataframe['Exercise Name'] == 'Pulldown') & (back_dataframe['Equipment'] == 'Cable') & (back_dataframe['Mechanics'] == 'Compound')]
        bent_over_barbell_row_barbell = create_exercise(bent_over_barbell_row_entry.iloc[0], 'Back')
        pulldown = create_exercise(pulldown_entry.iloc[0], 'Back')
        core_exercises.append(bent_over_barbell_row_barbell)
        core_exercises.append(pulldown)

    return core_exercises
    


def select_core_exercise(back_dataframe, equipment_availability):
    core_exercises = get_core_exercises(back_dataframe, equipment_availability)
    #get a random core exercise 
    random_int = random.randint(0, len(core_exercises) - 1)
    return core_exercises[random_int]



def find_row_exercise(allowed_exercises_dataframe, selected_exercises):
    #hit if no incline exists already, so we loop until we find one
    while True:
        random_exercise = select_random_exercise(allowed_exercises_dataframe, selected_exercises, "Back" )
        #if the random exercise is an incline exericse
        if ('Row' in random_exercise.name):
            return random_exercise
        else:
            #didn't find one this time, so continue looping
            continue

def find_pulldown_or_pullup_exercise(allowed_exercises_dataframe, selected_exercises):
    #hit if no incline exists already, so we loop until we find one
    while True:
        random_exercise = select_random_exercise(allowed_exercises_dataframe, selected_exercises, "Back" )
        #if the random exercise is an incline exericse
        if ('Pull-up' in random_exercise.name or 'Pulldown' in random_exercise.name):
            return random_exercise
        else:
            #didn't find one this time, so continue looping
            continue



def determine_remaining_back_exercises(allowed_exercises_dataframe, selected_exercises, number_of_exercises, equipment_availability, has_pullup_or_pulldown, has_row):
    for i in range(number_of_exercises):
        if(has_pullup_or_pulldown and has_row):
            selected_exercise = check_for_bodyweight_and_return_exercise(allowed_exercises_dataframe, selected_exercises, equipment_availability, "Back")
            selected_exercises.append(selected_exercise)
            allowed_exercises_dataframe = drop_exercise_from_dataframe(allowed_exercises_dataframe, selected_exercise)
        elif (has_pullup_or_pulldown):
            #Can flip has_row since if this is hit, it will always find a row
            has_row = True
            selected_exercise = find_row_exercise(allowed_exercises_dataframe, selected_exercises)
            selected_exercises.append(selected_exercise)
            allowed_exercises_dataframe = drop_exercise_from_dataframe(allowed_exercises_dataframe, selected_exercise)
        else:
            #This means there is a row but now pullup/down so we can flip it, since it will always find a pullup/down
            has_pullup_or_pulldown = True
            selected_exercise = find_pulldown_or_pullup_exercise(allowed_exercises_dataframe, selected_exercises)
            selected_exercises.append(selected_exercise)
            allowed_exercises_dataframe = drop_exercise_from_dataframe(allowed_exercises_dataframe, selected_exercise)
    return selected_exercises



def select_back_exercises(back_dataframe, equipment_availability, possible_equipment, sets):
    number_of_exercises = determine_number_of_exercises(sets)
    allowed_exercises_dataframe = create_possible_exercises_dataframe(back_dataframe, possible_equipment)
    #Compounds need to include at least 1 pullup/pulldown, and 1 row
    has_pullup_or_pulldown = False
    has_row = False
    selected_core_exercise = select_core_exercise(back_dataframe, equipment_availability)

    if ('Row' in selected_core_exercise.name):
        has_row = True
    if ('Pull-up' in selected_core_exercise.name or 'Pulldown' in selected_core_exercise.name):
        has_pullup_or_pulldown = True
    
    selected_exercises = []

    #don't need the if the check for noWeights here since noWeights will always result in pullups being chosen as a core exercise
    #that means we can always append the selected core exercise
    selected_exercises.append(selected_core_exercise)
    allowed_exercises_dataframe = drop_exercise_from_dataframe(allowed_exercises_dataframe, selected_core_exercise)
    number_of_exercises -= 1

    selected_exercises = determine_remaining_back_exercises(allowed_exercises_dataframe, selected_exercises, number_of_exercises, equipment_availability, has_pullup_or_pulldown, has_row)

    return selected_exercises




