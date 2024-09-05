from helpers import determine_number_of_exercises, create_possible_exercises_dataframe, determine_remaining_exercises

def select_ab_exercises(abs_dataframe, equipment_availability, possible_equipment, sets):
    number_of_exercises = determine_number_of_exercises(sets)
    allowed_exercises_dataframe = create_possible_exercises_dataframe(abs_dataframe, possible_equipment)

    selected_exercises = []

    #randomly selects from all, since I like all exercises here no matter the equipment available.
    selected_exercises = determine_remaining_exercises(allowed_exercises_dataframe, selected_exercises, number_of_exercises, "Abs")
    
    return selected_exercises