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

        protocol = Protocol()

        # process something like this
        # [[{'gate': 'X', 'link': None}, {'gate': 'X', 'link': None}],
        #  [{'gate': 'BD', 'link': 1}, {'gate': 'BD', 'link': None},
        #   {'gate': 'X', 'link': 1}, {'gate': 'H', 'link': None}, {'gate': 'H', 'link': None}]]
        for column in data:
            if not column:
                continue

            group_started = False
            group = []
            group_pos = []
            for pos, gate in enumerate(column):
                if gate['link'] != None:
                    if not group_started:
                        group_started = True
                    else:
                        group_pos.append(pos)
                        group.append(gate['gate'])
                        
                        print("process_group", group)
                        protocol.process_group(group_pos, group) # TODO
                        
                        group_started = False
                        group = []
                        group_pos = []
                        continue
                
                if group_started:
                    group_pos.append(pos)
                    group.append(gate['gate'])
                    continue

                print("process_gate:", gate['gate'])
                protocol.process_gate(pos, gate['gate'])
        
        print("---OUTPUT START---")
        protocol.qs.show_state_and_probs(True)
        print("---OUTPUT END---")
        # send response back
        response_message = "Data received successfully"
        return jsonify({"message": response_message})
    
    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)