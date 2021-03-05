
export interface MentorEvaluationDetails {
  mentorFirstTime?: boolean;
  principalProblems?: string;
  studentsWithoutAccompaniments?: string;
}

export interface MentorEvaluationActivities {
  meetings?: string;
  sports?: string;
  academicEvent?: string;
  socialEvent?: string;
  virtualAccompaniment?: string;
  other?: string;
}

export interface MentorEvaluationDependencies {
  coordinator?: string;
  teachers?: string;
  missions?: string;
  chancellor?: string;
  library?: string;
  firstSolvedByMentor?: string;
  otherServices?: string;
  other?: string;
}

export interface MentorEvaluationObservations {
  positives?: string;
  inconveniences?: string;
  suggestions?: string;
  other?: string;
}
