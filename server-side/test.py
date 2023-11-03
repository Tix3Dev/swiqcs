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

qs.show_state_and_probs(True)

# Output:

# Initial state: |00>
#  0.707106781186547462+0.000000000000000000i|00> -> 50.0%
# +0.707106781186547462+0.000000000000000000i|11> -> 50.0%