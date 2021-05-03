import { SGMAccompaniment } from '@utpl-rank/sgm-helpers';

export type IAccompanimentForm = {
  studentId: string;

  semesterKind: SGMAccompaniment.SemesterType;
  followingKind: SGMAccompaniment.FollowingType,

  problemDescription?: string,
  solutionDescription?: string,
  topic?: string,
  topicDescription?: string,

  important: boolean,

  problems: {
    none: boolean,
    academic: boolean,
    administrative: boolean,
    economic: boolean,
    psychosocial: boolean,
  },
}
