import { SGMAccompaniment, SGMMentor, SGMStudent } from '@utpl-rank/sgm-helpers';


export interface StudentReportData {
  accompaniments: SGMAccompaniment.readDTO[] | null;
  student: SGMStudent.readDTO | null;
  mentor: SGMMentor.readDTO | null;
  semesterKind: SGMAccompaniment.SemesterType | null;
  signature: string | undefined | null;
}
