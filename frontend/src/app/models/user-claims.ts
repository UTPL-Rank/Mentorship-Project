export interface AdminClaims {
  isAdmin: true;
}

export interface IntegratorClaims {
  isIntegrator: true;
  integratorId: string;
}

export interface MentorClaims {
  isMentor: true;
  mentorId: string;
  integratorId?: string;
}

export interface StudentClaims {
  isStudent: true;
  studentId: string;
  mentorId: string;
}

export type CreateUserClaims = IntegratorClaims | StudentClaims | MentorClaims | AdminClaims;
export interface UserClaims extends StudentClaims, MentorClaims, AdminClaims, IntegratorClaims {
  integratorId: string;
}
