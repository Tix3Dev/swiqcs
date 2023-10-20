from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from qcomputation import *

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/evaluate', methods=['POST'])
def receive_data():
    try:
        # receive
        data = request.get_json()
        print("Received data:", data)

        # DO SOMETHING

        # send response back
        response_message = "Data received successfully"
        return jsonify({"message": response_message})
    
    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)