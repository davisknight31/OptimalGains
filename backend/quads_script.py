import random
from helpers import create_exercise, determine_number_of_exercises, create_possible_exercises_dataframe, determine_remaining_exercises, drop_bodyweight_exercises, drop_exercise_from_dataframe, select_random_exercise

def get_leg_extensions(allowed_exercises_dataframe):
    leg_extensions_entry = allowed_exercises_dataframe.loc[(allowed_exercises_dataframe['Exercise Name'] == 'Leg Extension')]
    leg_extensions = create_exercise(leg_extensions_entry.iloc[0], 'Quads')
    leg_extensions.equipment = "Whatever is available/preferred"
    return leg_extensions

def get_squat_exercises(allowed_exercises_dataframe):
    squat_exercises = []
    squat_exercises_dataframe = allowed_exercises_dataframe[allowed_exercises_dataframe['Exercise Name'].str.contains('Squat', na = False)]
    for index, row in squat_exercises_dataframe.iterrows():
        if ('Split' not in row['Exercise Name'] and 'Single' not in row['Exercise Name'] and 'Dumbbell'):
            created_exercise = create_exercise(row, 'Quads')
            squat_exercises.append(created_exercise)
    return squat_exercises


def get_leg_press_exercises(allowed_exercises_dataframe):
    leg_press_exercises = []
    leg_press_exercises_dataframe = allowed_exercises_dataframe[allowed_exercises_dataframe['Exercise Name'].str.contains('Leg Presses', na = False)]
    for index, row in leg_press_exercises_dataframe.iterrows():
        created_exercise = create_exercise(row, 'Quads')
        leg_press_exercises.append(created_exercise)
    return leg_press_exercises


def select_core_exercise(allowed_exercises_dataframe, equipment_availability):
    #maybe can just group squats not including the world split, and leg presses. Randomly choose a leg press and squat, randomly choose between the two chose, remove squat if squat selected, and leg press if leg press selected
    potential_core_exercises = []
    #group squats and get random
    squat_exercises = get_squat_exercises(allowed_exercises_dataframe)
    random_int = random.randint(0, len(squat_exercises) - 1)
    potential_core_exercises.append(squat_exercises[random_int])

    if (equipment_availability == 'gym'):
        #group leg presses and get random
        leg_press_exercises = get_leg_press_exercises(allowed_exercises_dataframe)
        random_int = random.randint(0, len(leg_press_exercises) - 1)
        potential_core_exercises.append(leg_press_exercises[random_int])

    #get random of potential core_exercises
    random_int = random.randint(0, len(potential_core_exercises) - 1)
    core_exercise = potential_core_exercises[random_int]

    return core_exercise


def drop_other_core_exercises(allowed_exercises_dataframe, core_exercise):
    exercises_to_remove = []
    if ("Leg Presses" in core_exercise.name):
        exercises_to_remove = get_leg_press_exercises(allowed_exercises_dataframe)
    else:
        exercises_to_remove = get_squat_exercises(allowed_exercises_dataframe)

    for exercise in exercises_to_remove:
        allowed_exercises_dataframe = drop_exercise_from_dataframe(allowed_exercises_dataframe, exercise)

    return allowed_exercises_dataframe


def select_quad_exercises(quad_dataframe, equipment_availability, possible_equipment, sets):
    #I don't think body weight is helpful in a routine if weights are available for quads specifically. So do something similar to forearms/traps/delts, just remove all bodyweight if not in noWeights
    #I also don't think that of the bodyweight exercises, there is really a singular good core exercise, they are all squat/lunge variations so any will work

    #Gonna try and keep it at 3 quad exercises for as long as possible, unless special case
    #So at most, if it were to be sets of 24, then give 3 exercises at 4 sets a piece, making 12 per workout
    #Could give sets per exercise option

    number_of_exercises = determine_number_of_exercises(sets)

    #adding sled to possible equipment here since hacksquat and leg press can be good with sleds
    if (equipment_availability == 'gym'):
        possible_equipment.append('Sled')
    allowed_exercises_dataframe = create_possible_exercises_dataframe(quad_dataframe, possible_equipment)

    selected_exercises = []

    if (equipment_availability != 'noWeights'):
        #if not noWeights, drop bodyweight, and get a core exercise
        allowed_exercises_dataframe = drop_bodyweight_exercises(allowed_exercises_dataframe, "Quads")
        #get leg press or squat as core
        core_exercise = select_core_exercise(allowed_exercises_dataframe, equipment_availability)
        selected_exercises.append(core_exercise)
        allowed_exercises_dataframe = drop_exercise_from_dataframe(allowed_exercises_dataframe, core_exercise)
        #drop core exercises of same type as core
        allowed_exercises_dataframe = drop_other_core_exercises(allowed_exercises_dataframe, core_exercise)
        number_of_exercises -= 1

    if (number_of_exercises == 2):
        #if the number of exercises remaining is still 2, remove one more, since quad extensions will be added after, then determine remaining exercise, which will always be 1
        if (equipment_availability == 'gym'):
            number_of_exercises -= 1
            leg_extensions_execise = get_leg_extensions(allowed_exercises_dataframe)
            selected_exercises.append(leg_extensions_execise)
        selected_exercises = determine_remaining_exercises(allowed_exercises_dataframe, selected_exercises, number_of_exercises, "Quads")
    else:
        #Otherwise, this means it means it already is only 1 exercise, since quads will usually not be more than 3 total, so this has to be 1
        #Just get a random remaining exercise
        #In the future can adjust this ifelse to account for 4 exercises if needed, probably by getting a random exercise opposite of the core type, and adding it no matter what
        #Then remove others of similar type leaving no leg presses or squats in the dataset, so there will always be one of each but not more if 4+ exercises are needed.
        selected_exercises = determine_remaining_exercises(allowed_exercises_dataframe, selected_exercises, number_of_exercises, "Quads")

    
    return selected_exercises