import numpy as np

### basic stuff
# zero ket
ZKet = np.array([1,0])
# one ket
OKet = np.array([0,1])

### operator matrices
# identity
Id = np.array([
    [1,0],
    [0,1]
])
# pauli x
X = np.array([
    [0,1],
    [1,0]
])
# pauli y
Y = np.array([
    [0,0-1j],
    [0+1j,0]
])
# pauli z
Z = np.array([
    [1,0],
    [0,-1]
])
# hadamard
H = 1/np.sqrt(2) * np.array([
    [1,1],
    [1,-1]
])
# phase
S = np.array([
    [1,0],
    [0,0+1j]
])
# pi over eight
T = np.array([
    [1,0],
    [0,np.exp((0+1j)*np.pi/4)]
])
# |0><0>
P_0 = np.array([
    [1,0],
    [0,0]
])
# |1><1>
P_1 = np.array([
    [0,0],
    [0,1]
])

### all the quantum computations are done here
class QState:
    def __init__(self, qbit_cnt, info=False):
        self.qbit_cnt = qbit_cnt
        # create state |00...0> with qbit_cnt amount of zeros
        self.state = np.zeros(2**self.qbit_cnt, dtype=complex)
        self.state[0] = 1

        if info:
            max_bin_width = len(bin(len(self.state) - 1)[2:])
            binary_str = bin(0)[2:].zfill(max_bin_width)
            print("Initial state: |{}>".format(binary_str))
    
    # show all states including the impossible one (unless
    # otherwise noted) and show according probabilities
    # DISCLAIMER: rounding/floating point errors may occur
    def show_state_and_probs(self, reduced=False):
        max_len = 0
        for element in self.state:
            if reduced and element == 0+0j:
                continue

            curr_len = max(len(str(element.real)), len(str(element.imag)))
            if curr_len > max_len:
                max_len = curr_len
        
        max_bin_width = len(bin(len(self.state) - 1)[2:])

        for i, element in enumerate(self.state):
            if reduced and element == 0+0j:
                continue

            real_part_str = "{:.{width}f}".format(element.real, width=max_len)
            imaginary_part_str = "{:.{width}f}".format(element.imag, width=max_len)
            
            formatted_element = ("{}+{}i".format(real_part_str, imaginary_part_str) if element.imag >= 0 else
                                 "{}{}i".format(real_part_str, imaginary_part_str))

            binary_str = bin(i)[2:].zfill(max_bin_width)

            prob_str = str(round((np.absolute(element)**2)*100, 4))

            if i > 0 and element.real >= 0:
                print("+{}|{}>\t-> {}%".format(formatted_element, binary_str, prob_str))
            elif i > 0 and element.real < 0:
                print("{}|{}>\t-> {}%".format(formatted_element, binary_str, prob_str))
            elif i <= 0 and element.real >= 0:    
                print(" {}|{}>\t-> {}%".format(formatted_element, binary_str, prob_str))
            else:
                print("{}|{}>\t-> {}%".format(formatted_element, binary_str, prob_str))

    ###
    ### GATE CREATION HELPER ###
    ###
    
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

    def ctrl_ctrl(self, ctrl_pos1, ctrl_pos2, targ_func, *targ_pos_args):
        decomp = self.decomp_state(self.state)
        final_decomp = decomp.copy()

        for i in range(len(decomp)):
            ctrl_pos1_set = False
            ctrl_pos2_set = False
            for j in range(1, len(decomp[i])):
                if j-1 == ctrl_pos1 and np.array_equal(decomp[i][j], OKet):
                    ctrl_pos1_set = True
                elif j-1 == ctrl_pos2 and np.array_equal(decomp[i][j], OKet):
                    ctrl_pos2_set = True
                
                if (not ctrl_pos1_set) or (not ctrl_pos2_set):
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
     
    ###
    ### SINGLE-QUBIT GATES ###
    ###

    def pauli_x(self, pos):
        self.sing_qbit_op(pos, X)

    def pauli_y(self, pos):
        self.sing_qbit_op(pos, Y)

    def pauli_z(self, pos):
        self.sing_qbit_op(pos, Z)

    def hadamard(self, pos):
        self.sing_qbit_op(pos, H)
    
    def phase(self, pos):
        self.sing_qbit_op(pos, S)

    def pi_ov_8(self, pos):
        self.sing_qbit_op(pos, T)

    ###
    ### MULTI-QUBIT GATES ###
    ###

    # doesn't matter whether ctrl_pos smaller or bigger than targ_pos
    def cnot(self, ctrl_pos, targ_pos):
        self.ctrl(ctrl_pos, self.pauli_x, targ_pos)

    def cz(self, ctrl_pos, targ_pos):
        self.ctrl(ctrl_pos, self.pauli_z, targ_pos)
    
    def cp(self, ctrl_pos, targ_pos):
        self.ctrl(ctrl_pos, self.phase, targ_pos)
    
    def toffoli(self, ctrl_pos1, ctrl_pos2, targ_pos):
        self.ctrl_ctrl(ctrl_pos1, ctrl_pos2, self.pauli_x, targ_pos)

    def swap(self, pos1, pos2):
        # using special decomposition to achieve it's functionality:
        self.cnot(pos1, pos2)
        self.cnot(pos2, pos1)
        self.cnot(pos1, pos2)

    def fredkin(self, ctrl_pos, swap_pos1, swap_pos2):
        self.ctrl(ctrl_pos, self.swap, swap_pos1, swap_pos2)