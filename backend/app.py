
from flask import Flask, jsonify, request
from flask_cors import CORS
from random_plan import generateRoutine

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def getHome():
    return jsonify({"Test": "Test"})

@app.route('/optimal-gains/generate-routine', methods=['GET'])
def getRoutine():
    #returns routine as dict
    routine_dictionary = generateRoutine('ppl')
    return jsonify(routine_dictionary)



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1000, debug=True)