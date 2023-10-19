from flask import Flask, request, jsonify
from qcomputation import *

app = Flask(__name__)

@app.route('/products/add', methods=['POST'])
def receive_data():
    try:
        # receive
        data = request.json 
        print("Received data:", data)

        # DO SOMETHING

        # send response back
        response_message = "Data received successfully"
        return jsonify({"message": response_message})
    
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)