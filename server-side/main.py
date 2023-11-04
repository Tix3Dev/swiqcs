# This file is part of a quantum circuit simulator
# Everything is openly developed on GitHub: https://github.com/Tix3Dev/swiqcs
#
# Copyright (C) 2023  Yves Vollmeier <https://github.com/Tix3Dev> and main collaborators
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

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

        qbit_cnt = data[0]
        data = data[1:]

        # sanity cleaning of data (remove None elements from columns)
        # TODO: this sometimes loops for infinity
        i = 0
        while True:
            if i >= len(data):
                break
            if not data[i]:
                continue
            j = 0
            while True:
                if j >= len(data[i]):
                    break
                if data[i][j] == None:
                    data[i].pop(j)
                    j -= 1
                j += 1
            i += 1

        print("New data:", data)

        protocol = Protocol(qbit_cnt, True)

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
        response_message = protocol.qs.get_state_and_probs_str(True)
        return jsonify({"message": response_message})

    except Exception as e:
       print("ERROR:", e)
       return jsonify({"message": "SERVER-SIDE ERROR: " + str(e)})

if __name__ == '__main__':
    app.run(debug=True)