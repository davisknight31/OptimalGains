from helpers import determine_number_of_exercises, create_possible_exercises_dataframe, determine_remaining_exercises, drop_bodyweight_exercises

def select_glute_exercises(glute_dataframe, equipment_availability, possible_equipment, sets):
    #Will always be 1-2 exercises
    number_of_exercises = determine_number_of_exercises(sets)
    allowed_exercises_dataframe = create_possible_exercises_dataframe(glute_dataframe, possible_equipment)

    selected_exercises = []

    if (equipment_availability != 'noWeights'):
        allowed_exercises_dataframe = drop_bodyweight_exercises(allowed_exercises_dataframe, "Glutes")

    #allowed exercises is created based on possible equipment, and since I don't care about a core here, can just randomly select from what is left in the allowed dataframe
    #I don't care about a core since there will always be a squat or leg press movement which will hit glutes a ton
    #UNLESS ADVANCED, where they are quad focused pressing, then I'll need to add some notes or maybe a core exercise selector to target glutes specificallyy
    selected_exercises = determine_remaining_exercises(allowed_exercises_dataframe, selected_exercises, number_of_exercises, "Glutes")
    
    return selected_exercises