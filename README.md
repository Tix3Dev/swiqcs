# swiqcs
**_The Swiss Quantum Circuit Simulator_**

# Intro
The goal of this project is to make a python framework to programmatically create and execute quantum circuits. Additionally a webinterface is made to graphically create the quantum circuits. The focus however lies on understanding how quantum circuits and their simulation work, so the python code revolves more around understandability rather than performance. This is also why the webinterface may still have some unfixed bugs.

# Usage
## Python Framework
1. Install requirements
2. Copy `qcomputation.py` into your project folder
3. Create a file which contains the code, e.g.:
```python
### Create a Bell State ###

from qcomputation import QState

# First argument: Number of available qubits
# Second argument: Print information (True=yes, False=no)
qs = QState(2, True)

# If you are unsure which argument is used for which functionality,
# consult qcomputation.py
# E.g First argument of cnot: Control Position; Second argument: Target position
qs.hadamard(0)
qs.cnot(0, 1)

# Print all states including the impossible ones unless otherwise noted (in which
# case first argument=False) and show according probabilites
qs.show_state_and_probs(True)
```
4. Run!
```
Initial state: |00>
 0.707106781186547462+0.000000000000000000i|00> -> 50.0%
+0.707106781186547462+0.000000000000000000i|11> -> 50.0%
```

## Webinterface
1. Install requirements
2. In `client-side/`, run `yarn start`
3. In `server-side/`, run `python main.py`
4. Click "Add row" to add qubits
5. Click the gate you want to add (red boxes), then click the place where you want to position it (NOTE: CR=Control, BD=Black Dot)
6. To create vertical wires (e.g. for a CNOT, consisting of a CR and a X), click "Link", then click the position where the vertical wire should start, then where it should end (both have to be occupied by a gate, however in between there may very well be nothing)
7. To execute the circuit, click "Run" and wait for the server to send the output back

# How it works
As this simulator uses a state vector simulation approach, upon initialization of `QState`, a numpy array representing the initial vector is created. The vector may be changed by applying gates onto qubits. The gate may either be a single-qubit gate, or a multi-qubit gate.

## Single-Qubit gate
Consider the following quantum circuit:

<img src="https://github.com/Tix3Dev/swiqcs/blob/main/misc/quantum-circuit%20explanation%201.png">

Each horizontal wire represents a qubit. Per convention, we initialize all qubits to be in the $|0\rangle$ state. According to one of the postulates of quantum mechanics, we know that the state of the total system is the Kronecker product of all the individual states of the systems making up the total system. In the picture the total state in the beginning thus is:
$$|0\rangle \otimes|0\rangle \otimes|0\rangle \otimes|0\rangle \otimes|0\rangle$$

As remarked before, this state may change due to gates being applied. The first change will be the top left box containing a "H" (so called Hadamard Gate), since the algorithm goes through each column from top to bottom (and from left column to right column). If we apply a Hadamard gate to the $|0\rangle$ state, we will get:
$$
\begin{aligned}
& H(|0\rangle)=\frac{1}{\sqrt{2}}\left\{\begin{array}{cc}
1 & 1 \\
1 & -1
\end{array}\right\}\left\{\begin{array}{l}
1 \\
0
\end{array}\right\}=\frac{1}{\sqrt{2}}\left\{\begin{array}{l}
1 \\
1
\end{array}\right\}=\frac{1}{\sqrt{2}}\left(\left\{\begin{array}{l}
1 \\
0
\end{array}\right\}+\left\{\begin{array}{l}
0 \\
1
\end{array}\right\}\right)=\frac{1}{\sqrt{2}}(|0\rangle+|1\rangle)
\end{aligned}
$$








