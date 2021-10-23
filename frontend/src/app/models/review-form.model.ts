import { SGMAccompaniment } from '@utpl-rank/sgm-helpers';

export interface ReviewFormValue {
  isGiven?: boolean | null;
  qualification?: SGMAccompaniment.QualificationType;
  comment?: string | null;
  digitalSignature: string;
}
