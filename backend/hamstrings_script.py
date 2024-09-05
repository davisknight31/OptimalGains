import random
from helpers import create_exercise, determine_number_of_exercises, create_possible_exercises_dataframe, determine_remaining_exercises, drop_bodyweight_exercises, drop_exercise_from_dataframe

def get_compound_exercises(allowed_exercises_dataframe):
    compound_hamstring_exercises = []
    compound_hamstring_exercises_dataframe = allowed_exercises_dataframe[allowed_exercises_dataframe['Mechanics'].str.contains('Compound', na = False)]
    for index, row in compound_hamstring_exercises_dataframe.iterrows():
            created_exercise = create_exercise(row, 'Hamstrings')
            compound_hamstring_exercises.append(created_exercise)
    return compound_hamstring_exercises

# def get_isolation_exercises(allowed_exercises_dataframe):
#     isolated_hamstring_exercises = []
#     isolated_hamstring_exercises_dataframe = allowed_exercises_dataframe[allowed_exercises_dataframe['Mechanics'].str.contains('Isolated', na = False)]
#     for index, row in isolated_hamstring_exercises_dataframe.iterrows():
#             created_exercise = create_exercise(row, 'Hamstrings')
#             isolated_hamstring_exercises.append(created_exercise)
#     return isolated_hamstring_exercises

def drop_remaining_compound_exercises(allowed_exercises_dataframe):
    compound_exercises = get_compound_exercises(allowed_exercises_dataframe)
    for exercise in compound_exercises:
        allowed_exercises_dataframe = drop_exercise_from_dataframe(allowed_exercises_dataframe, exercise)
    return allowed_exercises_dataframe


def select_core_exercise(allowed_exercises_dataframe):
    compound_exercises = get_compound_exercises(allowed_exercises_dataframe)
    random_int = random.randint(0, len(compound_exercises) - 1)
    core_exercise = compound_exercises[random_int]
    return core_exercise




def select_hamstring_exercises(hamstring_dataframe, equipment_availability, possible_equipment, sets):
    #The core exercise needs to be one of the compound in the csv
    #after that, usually there will only be one more exercise, but can account for two
    #guranteeing a leg curl maybe is a good idea, but there are so many maybe just let it be random isolation including glute hams and e
    number_of_exercises = determine_number_of_exercises(sets)
    allowed_exercises_dataframe = create_possible_exercises_dataframe(hamstring_dataframe, possible_equipment)

    selected_exercises = []
    

    if (equipment_availability == 'gym'):
        #if gym only, drop bodyweight, since less options and bodyweight is pretty good actually
        allowed_exercises_dataframe = drop_bodyweight_exercises(allowed_exercises_dataframe, "Hamstrings")

    if (equipment_availability != 'noWeights'):
        #get a core exercise, append, and drop
        core_exercise = select_core_exercise(allowed_exercises_dataframe)
        selected_exercises.append(core_exercise)
        #drop core
        allowed_exercises_dataframe = drop_exercise_from_dataframe(allowed_exercises_dataframe, core_exercise)
        #drop other compounds so they cannot be chosen anymore
        allowed_exercises_dataframe = drop_remaining_compound_exercises(allowed_exercises_dataframe)

        #decerement number of exercises
        number_of_exercises -= 1

    #get remaining exercises with what is left in the dataframe
    selected_exercises = determine_remaining_exercises(allowed_exercises_dataframe, selected_exercises, number_of_exercises, "Hamstrings")
    
    return selected_exercises