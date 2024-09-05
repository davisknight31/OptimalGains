import random
from helpers import create_exercise, determine_number_of_exercises, drop_exercise_from_dataframe, create_possible_exercises_dataframe, determine_remaining_exercises


def get_bodyweight_side_delt_exercises(allowed_exercises_dataframe):
    bodyweight_exercises = []
    random_item_lateral_raise_entry = allowed_exercises_dataframe.loc[(allowed_exercises_dataframe['Exercise Name'] == 'Lateral Raise') & (allowed_exercises_dataframe['Equipment'] == 'Body Weight')]
    random_item_lateral_raise = create_exercise(random_item_lateral_raise_entry.iloc[0], "Side Delts")
    
    bodyweight_exercises.append(random_item_lateral_raise)

    return bodyweight_exercises

def get_lateral_raise_exercises(allowed_exercises_dataframe):
    lateral_raise_exercises = []
    lateral_raise_exercises_dataframe = allowed_exercises_dataframe[allowed_exercises_dataframe['Exercise Name'].str.contains('Lateral Raise', na = False)]
    for index, row in lateral_raise_exercises_dataframe.iterrows():
        created_exercise = create_exercise(row, 'Side Delts')
        lateral_raise_exercises.append(created_exercise)
    return lateral_raise_exercises


def select_core_exercises(allowed_exercises_dataframe):
    core_exercises = []

    #group exercises
    lateral_raise_exercises = get_lateral_raise_exercises(allowed_exercises_dataframe)
    
    #get random
    random_int = random.randint(0, len(lateral_raise_exercises) - 1)
    lateral_raise_exercise = lateral_raise_exercises[random_int]

    core_exercises.append(lateral_raise_exercise)

    return core_exercises


# def determine_remaining_side_delt_exercises(allowed_exercises_dataframe, selected_exercises, number_of_exercises):
#     for i in range(number_of_exercises):
#         if (not allowed_exercises_dataframe.empty):
#             random_exercise = select_random_exercise(allowed_exercises_dataframe, selected_exercises, "Side Delts" )
#             selected_exercises.append(random_exercise)
#             allowed_exercises_dataframe = drop_exercise_from_dataframe(allowed_exercises_dataframe, random_exercise)
#     return selected_exercises




def select_side_delt_exercises(side_delt_dataframe, equipment_availability, possible_equipment, sets):
    number_of_exercises = determine_number_of_exercises(sets)
    allowed_exercises_dataframe = create_possible_exercises_dataframe(side_delt_dataframe, possible_equipment)

    selected_exercises = []

    #get body weight exercises
    bodyweight_exercises = get_bodyweight_side_delt_exercises(allowed_exercises_dataframe)

    #drop core exercises from potential exercises dataframe since if we get random, or have weights, we do not want any bodyweight exercises in the dataframe
    for exercise in bodyweight_exercises:
        allowed_exercises_dataframe = drop_exercise_from_dataframe(allowed_exercises_dataframe, exercise)


    #get core exercises
    if(equipment_availability == 'noWeights'):
        core_exercises = bodyweight_exercises
        #returning because this is really all that can be done with bodyweight, no matter the length. So fill in all sets with this
        return core_exercises
    else:
        core_exercises = select_core_exercises(allowed_exercises_dataframe)
        for exercise in core_exercises:
            allowed_exercises_dataframe = drop_exercise_from_dataframe(allowed_exercises_dataframe, exercise)

    #This will always be one lateral raise exercise since that is the core of building side delts
    selected_exercises = core_exercises

    #decrements by 1 since always 1 core exercise for side delts
    number_of_exercises -= 1


    if (number_of_exercises > 0):
        selected_exercises = determine_remaining_exercises(allowed_exercises_dataframe, selected_exercises, number_of_exercises, "Side Delts")
    
    return selected_exercises