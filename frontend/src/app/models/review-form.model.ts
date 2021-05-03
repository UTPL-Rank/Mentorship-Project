import { SGMAccompaniment } from '@utpl-rank/sgm-helpers';

export interface ReviewFormValue {
  qualification: SGMAccompaniment.QualificationType;
  comment?: string | null;
  digitalSignature: string;
}
