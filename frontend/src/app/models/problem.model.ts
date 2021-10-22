
export interface SGMProblem {
  id?: string | null;
  name?: string | null;
  subproblems?: SGMSubProblem [];
}

export interface SGMSubProblem {
  name?: string | null;
  items?: string [] | null;
}
