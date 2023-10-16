# pseudocode

def decomp_state(state):
    # blah

    return decomp

def comp_state(decomp):
    # blah

    return state

def controlled(self, ctrl_pos, targ_func, *targ_pos_args):
    decomp = decomp_state(self.state)
    # decomp = [[a, zket, zket], [b, zket, oket], [c, oket, zket], [d, oket, oket]]

    for i in range(len(decomp)):
        for j in range(1, len(decomp[i])):
            if j-1 != ctrl_pos or decomp[i][j] != oket:
                continue

            # decomp[i][targ_pos] = np.matmul(op_matrix, decomp[i][targ_pos])
            orig_qbit_cnt = self.qbit_cnt
            self.qbit_cnt = len(decomp[i])-1

            orig_state = self.state
            self.state = comp_state([decomp[i]])
            targ_func(*targ_pos_args)
            decomp[i] = decomp_state(self.state)
            
            self.qbit_cnt = orig_qbit_cnt
            self.state = orig_state

    self.state = comp_state(decomp)