from helpers import determine_number_of_exercises, create_possible_exercises_dataframe, determine_remaining_exercises, drop_bodyweight_exercises, create_exercise, select_random_exercise

def get_hip_adductor_exercise(allowed_exercises_dataframe):
    hip_adductor_exercises_dataframe = allowed_exercises_dataframe[allowed_exercises_dataframe['Target_Muscles'].str.contains('Hip Adductors', na = False)]
    random_hip_adductor_exercise = select_random_exercise(hip_adductor_exercises_dataframe, [], 'Hip Adductors')
    
    return random_hip_adductor_exercise

def get_hip_abductor_exercise(allowed_exercises_dataframe):
    hip_abductor_exercises_dataframe = allowed_exercises_dataframe[allowed_exercises_dataframe['Target_Muscles'].str.contains('Hip Abductors', na = False)]
    random_hip_abductor_exercise = select_random_exercise(hip_abductor_exercises_dataframe, [], 'Hip Abductors')

    return random_hip_abductor_exercise
    

def select_hip_exercises(hip_dataframe, equipment_availability, possible_equipment, sets):
    #Will always be 2 exercises, one abduction, and one adduction
    number_of_exercises = determine_number_of_exercises(sets)

    
    allowed_exercises_dataframe = create_possible_exercises_dataframe(hip_dataframe, possible_equipment)
    
    if (equipment_availability == 'gym'):
        allowed_exercises_dataframe = drop_bodyweight_exercises(allowed_exercises_dataframe, "Hips")

    hip_adductor_exercise = get_hip_adductor_exercise(allowed_exercises_dataframe)
    hip_abductor_exercise = get_hip_abductor_exercise(allowed_exercises_dataframe)

    selected_exercises = []
    selected_exercises.append(hip_adductor_exercise)
    selected_exercises.append(hip_abductor_exercise)
    
    return selected_exercises