from helpers import determine_number_of_exercises, drop_bodyweight_exercises, create_possible_exercises_dataframe, determine_remaining_exercises  


def select_front_delt_exercises(front_delt_dataframe, equipment_availability, possible_equipment, sets):
    number_of_exercises = determine_number_of_exercises(sets)
    allowed_exercises_dataframe = create_possible_exercises_dataframe(front_delt_dataframe, possible_equipment)

    selected_exercises = []

    if (equipment_availability != 'noWeights'):
        allowed_exercises_dataframe = drop_bodyweight_exercises(allowed_exercises_dataframe, "Front Delts")

    #allowed exercises is created based on possible equipment, and since I don't care about a core here, can just randomly select from what is left in the allowed dataframe
    selected_exercises = determine_remaining_exercises(allowed_exercises_dataframe, selected_exercises, number_of_exercises, "Front Delts")
    
    return selected_exercises