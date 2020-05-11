export interface AdminClaims {
  isAdmin: true;
}

export interface MentorClaims {
  isMentor: true;
  mentorId: string;
}

export interface StudentClaims {
  isStudent: true;
  studentId: string;
  mentorId: string;
}

export type CreateUserClaims = StudentClaims | MentorClaims | AdminClaims;
export interface UserClaims extends StudentClaims, MentorClaims, AdminClaims { }
