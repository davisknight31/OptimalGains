from helpers import determine_number_of_exercises, drop_bodyweight_exercises, create_possible_exercises_dataframe, determine_remaining_exercises

# def drop_trap_bodyweight_exercises(allowed_exercises_dataframe):
#     #this function only exists here so that they can be removed from the dataframe if not in noWeights
#     bodyweight_exercise_entries = allowed_exercises_dataframe.loc[(allowed_exercises_dataframe['Equipment'] == 'Body Weight')]
    
#     for index, row in bodyweight_exercise_entries.iterrows():
#         bodyweight_exercise = create_exercise(row, "Traps")
#         allowed_exercises_dataframe = drop_exercise_from_dataframe(allowed_exercises_dataframe, bodyweight_exercise)

#     return allowed_exercises_dataframe

def select_trap_exercises(trap_dataframe, equipment_availability, possible_equipment, sets):
    #really can just get anything available, don't really care about core since traps are hit a lot during back, so anything is fine

    number_of_exercises = determine_number_of_exercises(sets)
    allowed_exercises_dataframe = create_possible_exercises_dataframe(trap_dataframe, possible_equipment)

    selected_exercises = []

    if (equipment_availability != 'noWeights'):
        allowed_exercises_dataframe = drop_bodyweight_exercises(allowed_exercises_dataframe, "Traps")

    #allowed exercises is created based on possible equipment, and since I don't care about a core here, can just randomly select from what is left in the allowed dataframe
    selected_exercises = determine_remaining_exercises(allowed_exercises_dataframe, selected_exercises, number_of_exercises, "Traps")
    
    return selected_exercises