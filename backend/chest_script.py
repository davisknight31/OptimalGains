
import random
from helpers import create_exercise, select_random_exercise, determine_number_of_exercises, drop_exercise_from_dataframe, check_for_bodyweight_and_return_exercise, create_possible_exercises_dataframe


def get_core_exercises(chest_dataframe, equipment_availability):
    core_exercises = []
    #always adds dumbbell compounds to core exercises since there is a check later for what to do if no equipment
    flat_dumbbell_bench_press = chest_dataframe.loc[(chest_dataframe['Exercise Name'] == 'Bench Press') & (chest_dataframe['Equipment'] == 'Dumbbell') & (chest_dataframe['Mechanics'] == 'Compound')]
    incline_dumbbell_bench_press = chest_dataframe.loc[(chest_dataframe['Exercise Name'] == 'Incline Bench Press') & (chest_dataframe['Equipment'] == 'Dumbbell') & (chest_dataframe['Mechanics'] == 'Compound')]
    flat_dumbbell = create_exercise(flat_dumbbell_bench_press.iloc[0], 'Chest')
    incline_dumbbell = create_exercise(incline_dumbbell_bench_press.iloc[0], 'Chest')
    core_exercises.append(flat_dumbbell)
    core_exercises.append(incline_dumbbell)

    #if anything higher than dumbbells then add barbell movements to core
    #since there is a check later for noWeights it is unncessary to check for that
    if (equipment_availability != 'dumbbells'):
        flat_barbell_bench_press = chest_dataframe.loc[(chest_dataframe['Exercise Name'] == 'Bench Press') & (chest_dataframe['Equipment'] == 'Barbell') & (chest_dataframe['Mechanics'] == 'Compound')]
        incline_barbell_bench_press = chest_dataframe.loc[(chest_dataframe['Exercise Name'] == 'Incline Bench Press') & (chest_dataframe['Equipment'] == 'Barbell') & (chest_dataframe['Mechanics'] == 'Compound')]
        flat_barbell = create_exercise(flat_barbell_bench_press.iloc[0], 'Chest')
        incline_barbell = create_exercise(incline_barbell_bench_press.iloc[0], 'Chest')
        core_exercises.append(flat_barbell)
        core_exercises.append(incline_barbell)

    return core_exercises
    

def select_core_exercise(chest_dataframe, equipment_availability):
    core_exercises = get_core_exercises(chest_dataframe, equipment_availability)
    #get a random core exercise 
    random_int = random.randint(0, len(core_exercises) - 1)
    return core_exercises[random_int]




#KEEPING THIS HERE BECASUE NOT SURE IF IT SHOULD ACTUALLY BE IN HELPERS YET    
# def check_for_bodyweight_and_return_exercise(exercise_dataframe, selected_exercises, equipment_availability, category):
#     while True:
#         random_exercise = select_random_exercise(exercise_dataframe, selected_exercises, category)
#         #if the random exercise is a body weight exercise
#         if ('Body Weight' in random_exercise.equipment): 
#             # print(selected_exercises)
#             bodyweight_count = 0
#             #count the number of body weight exercises currently in the routine
#             for exercise in selected_exercises:
#                     if ('Body Weight' in exercise.equipment):
#                         bodyweight_count += 1
#             #if the equipment availability is only dumbbellss, we want to limit the routine to 2 bodyweight exercises, continue if already at 2
#             if (equipment_availability == 'dumbbells' and bodyweight_count >= 2):
#                 continue
#             #else, if the equipment availability is not noweights or dumbbells, and there is already a bodyweight exercise in the routine, continue
#             #the noweights check is necessary because we want to make sure noweights get exercises added after 1
#             elif ((equipment_availability != 'noWeights' and equipment_availability != 'dumbbells') and bodyweight_count >= 1):
#                 continue
#             #otherwise, append the exericse, drop it, and break the while loop since we found a compatible exercise for this iteration
#             else:
#                 return random_exercise
#         #otherwise, just add it
#         else:
#             return random_exercise


#WILL NOT BE A HELPER SINCE OTHER MUSCLE GROUPS DO NOT NEED AN INCLINE EXERCISE
def check_for_incline_and_return_exercise(allowed_exercises_dataframe, selected_exercises):
    #hit if no incline exists already, so we loop until we find one
    while True:
        random_exercise = select_random_exercise(allowed_exercises_dataframe, selected_exercises, "Chest" )
        #if the random exercise is an incline exericse
        if ('Incline' in random_exercise.name):
            return random_exercise
        else:
            #didn't find one this time, so continue looping
            continue




def determine_remaining_chest_exercises(allowed_exercises_dataframe, selected_exercises, number_of_exercises, has_incline, equipment_availability):
    for i in range(number_of_exercises):
        if (has_incline):
            selected_exercise = check_for_bodyweight_and_return_exercise(allowed_exercises_dataframe, selected_exercises, equipment_availability, "Chest")
            selected_exercises.append(selected_exercise)
            allowed_exercises_dataframe = drop_exercise_from_dataframe(allowed_exercises_dataframe, selected_exercise)
        else:
            #hit if no incline exists already, so we call method which finds one
            #this means we can flip the flag since after this is hit once, we always will have an incline exercise
            has_incline = True
            selected_exercise = check_for_incline_and_return_exercise(allowed_exercises_dataframe, selected_exercises)
            selected_exercises.append(selected_exercise)
            allowed_exercises_dataframe = drop_exercise_from_dataframe(allowed_exercises_dataframe, selected_exercise)
    return selected_exercises




def select_chest_exercises(chest_dataframe, equipment_availability, possible_equipment, sets):
    #At least 1 compound, 1 flat, 1 incline, including the compound.
    #brandNew, beginner, intermediate, advanced

    #determines exercise number based on sets
    number_of_exercises = determine_number_of_exercises(sets)

    #puts all possible exercises that can be performed based on the available equipment into a dataframe
    allowed_exercises_dataframe = create_possible_exercises_dataframe(chest_dataframe, possible_equipment)

    #determine core exercises and get a random core exercise   
    selected_core_exercise = select_core_exercise(chest_dataframe, equipment_availability)
    
    selected_exercises = []
    #flag for checking if an incline exercise is included in the selected list so far
    has_incline = False
    
    #if the user did not enter that they have no weights, meaning they do have access to weights, add the randomly selected core exercise to selected_exercises, drop it from all exercise dataframe, and decrement number_of_exercises
    #the earlier logic regarding dumbbells and barbells ensures that the user only could have a core exercise that aligns with their equipment
    #this check also means that if the user only has body weight, then the algo later will just choose any of the body weight exercises, giving no priority to a compound, since they are limited in movements at that point
    if (equipment_availability != 'noWeights'):
        selected_exercises.append(selected_core_exercise)
        allowed_exercises_dataframe = drop_exercise_from_dataframe(allowed_exercises_dataframe, selected_core_exercise)
        number_of_exercises -= 1
        if ('Incline' in selected_core_exercise.name):
            has_incline = True

    #hard to break into helper since muscle groups will probably have unique properties for determining equal routines, for example: chest needing incline
    selected_exercises = determine_remaining_chest_exercises(allowed_exercises_dataframe, selected_exercises, number_of_exercises, has_incline, equipment_availability)
    
    return selected_exercises