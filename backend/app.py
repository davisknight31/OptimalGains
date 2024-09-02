
from flask import Flask, jsonify, request
from flask_cors import CORS
from backend.generate_routine import generate_routine

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def getHome():
    return jsonify({"Test": "Test"})

@app.route('/optimal-gains/generate-routine', methods=['GET'])
def getRoutine():
    experience_level = request.args.get('experienceLevel', default = 'Test')
    split_type = request.args.get('splitType', default = 'Test')
    days_in_the_gym = request.args.get('daysInTheGym', default = 'Test')
    overall_goal= request.args.get('overallGoal', default = 'Test')
    equipment_availability = request.args.get('equipmentAvailability', default = 'Test')
    #returns routine as dict
    routine_dictionary = generate_routine(experience_level, split_type, days_in_the_gym, overall_goal, equipment_availability)
    return jsonify(routine_dictionary)



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1000, debug=True)