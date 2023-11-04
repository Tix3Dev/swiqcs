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

https://github.com/Tix3Dev/swiqcs/assets/52136652/0a5e66a9-86b7-40f6-b594-b02c5d7d8526

# How it works
As this simulator uses a state vector simulation approach, upon initialization of `QState`, a numpy array representing the initial vector is created. The vector may be changed by applying gates onto qubits. The gate may either be a single-qubit gate, or a multi-qubit gate.

## Single-Qubit gate
Consider the following quantum circuit:

<img src="https://github.com/Tix3Dev/swiqcs/blob/main/misc/quantum-circuit%20explanation%201.png">

Each horizontal wire represents a qubit. Per convention, we initialize all qubits to be in the $|0\rangle$ state. According to one of the postulates of quantum mechanics, we know that the state of the total system is the Kronecker product of all the individual states of the systems making up the total system. In the picture the total state in the beginning thus is:
```math
|0\rangle \otimes|0\rangle \otimes|0\rangle \otimes|0\rangle \otimes|0\rangle
```

As remarked before, this state may change due to gates being applied. The first change will be the top left box containing a "H" (so called Hadamard Gate), since the algorithm goes through each column from top to bottom (and from left column to right column). If we apply a Hadamard gate to the $|0\rangle$ state, we will get:
```math
\begin{aligned}
& H(|0\rangle)=\frac{1}{\sqrt{2}}\left[\begin{array}{cc}
1 & 1 \\
1 & -1
\end{array}\right]\left[\begin{array}{l}
1 \\
0
\end{array}\right]=\frac{1}{\sqrt{2}}\left[\begin{array}{l}
1 \\
1
\end{array}\right]=\frac{1}{\sqrt{2}}\left(\left[\begin{array}{l}
1 \\
0
\end{array}\right]+\left[\begin{array}{l}
0 \\
1
\end{array}\right]\right)=\frac{1}{\sqrt{2}}(|0\rangle+|1\rangle)
\end{aligned}
```
So to get the new state of the total system, we do:
```math
H(|0\rangle) \otimes|0\rangle \otimes|0\rangle \otimes|0\rangle \otimes|0\rangle
```

Programmatically, we only want to apply one matrix $M$ to the state, so we'll just add some placeholders, i.e. identity matrices that don't change anything:
```math
\begin{aligned}
& M(|0\rangle \otimes|0\rangle \otimes|0\rangle \otimes|0\rangle \otimes|0\rangle)=(H \otimes I \otimes I \otimes I \otimes I)(|0\rangle \otimes|0\rangle \otimes|0\rangle \otimes|0\rangle \otimes|0\rangle) \\
& =H|0\rangle \otimes I|0\rangle \otimes I|0\rangle  \otimes I|0\rangle  \otimes I|0\rangle 
\end{aligned}
```
Since:
```math
H(|0\rangle)=H|0\rangle
```
So the respective code will look like this:
```python
# e.g. turns [A, B, C, D] into A ⊗ B ⊗ C ⊗ D
def op_mats_arr_to_tens(self, op_mats_arr):
    result = np.array([[1.0+0j]], dtype=complex)
    for op_mat in op_mats_arr:
        result = np.kron(result, op_mat)
    
    return result

def sing_qbit_op(self, pos, op_mat):
    op_mats_arr = (
          (pos)*[Id]
        + (1)*[op_mat]
        + (self.qbit_cnt-pos-1)*[Id]
    )
    gate = self.op_mats_arr_to_tens(op_mats_arr)
    self.state = np.matmul(gate, self.state)

# E.g. used for:
def pauli_x(self, pos):
    self.sing_qbit_op(pos, X)
```

## Multi-Qubit gate
Multi-Qubit gates often come in a variety of different shapes. All the gates we have can be broken down into controlled gates. Gates such as SWAP can for example be decomposed into three CNOT gates. Thus, we will now have a look at controlled gates (controlled-controlled gates are nearly identical, except for some conditions).

### Controlled gates
Thd approach taken here is very unconventional and inefficient, however the approach makes it intrinsically easy to understand what is actually going on:
1. Decompose the state into it's computational basis form, e.g
```math
\left[\begin{array}{l}
a \\
b \\
c \\
d
\end{array}\right]=a|00\rangle+b|01\rangle+c|10\rangle+d|11\rangle
```
2. Go over each summand (e.g. $a|00\rangle$) and check if the qubit at `ctrl_pos` is set to one
3. If no, just continue
4. If yes, apply the target function ONLY to the summand (e.g. `pauli_x` for CNOT) -> Add result to a temporary variable ("like adding a new element to an array")
5. When we're done looping over all the summands, convert the temporary variable back to a normal state 
```math
\left[\begin{array}{l}
w \\
x \\
y \\
z
\end{array}\right]
```
6. This state now becomes the main state

The code for this is a bit more complex, however it should make sense if the idea was understood:
```python
# e.g. turns np.array([a, b, c, d])
# into [[a, ZKet, ZKet], [b, ZKet, OKet], [c, OKet, ZKet], [d, OKet, OKet]]
# both represent a*ZKET⊗ZKet + b*ZKet⊗OKet + c*OKet⊗ZKet + d*OKet⊗OKet
def decomp_state(self, comp):
    decomp = []

    max_bin_width = len(bin(len(comp) - 1)[2:])
    for i in range(len(comp)):
        binary_str = bin(i)[2:].zfill(max_bin_width)
        
        sub_decomp = [comp[i]]
        for letter in binary_str:
            if letter == "0":
                sub_decomp.append(ZKet)
            elif letter == "1":
                sub_decomp.append(OKet)
        decomp.append(sub_decomp)
    
    return decomp

# e.g. turns [[a, ZKet, ZKet], [b, ZKet, OKet], [c, OKet, ZKet], [d, OKet, OKet]]
# into np.array([a, b, c, d])
# both represent a*ZKET⊗ZKet + b*ZKet⊗OKet + c*OKet⊗ZKet + d*OKet⊗OKet
def comp_state(self, decomp):
    state = np.zeros(2**(len(decomp[0])-1), dtype=complex)

    for element in decomp:
        state += element[0]*self.op_mats_arr_to_tens(element[1:])[0]

    return state

# decompose state into computation basis form, e.g.: [a,b,c,d] -> a|00>+b|01>+c|10>+d|11>
# then go over each summand and check if the qubit at ctrl_pos is set to one
# if no, just continue
# if yes, apply the target function to the summand -> add result to a temporary variable
# when looped over all summands, convert the temporary variable back to a normal state [w,x,y,z]
# which then becomes the main state
def ctrl(self, ctrl_pos, targ_func, *targ_pos_args):
    decomp = self.decomp_state(self.state)
    final_decomp = decomp.copy()

    for i in range(len(decomp)):
        for j in range(1, len(decomp[i])):
            if j-1 != ctrl_pos or np.array_equal(decomp[i][j], ZKet):
                continue
            
            orig_qbit_cnt = self.qbit_cnt
            self.qbit_cnt = len(decomp[i])-1

            orig_state = self.state
            self.state = self.comp_state([decomp[i]])
            targ_func(*targ_pos_args)
            # the following one line is the workaround since `final_decomp.remove(decomp[i])` doesn't work
            final_decomp = [item for item in final_decomp if not (all(np.array_equal(xi, yi) for xi, yi in zip(item, decomp[i])))]
            final_decomp += self.decomp_state(self.state)
            
            self.qbit_cnt = orig_qbit_cnt
            self.state = orig_state
            break # out of second for loop

    self.state = self.comp_state(final_decomp)
```
