import { QualificationKind } from './accompaniment.model';

export interface ReviewFormValue {
  qualification: QualificationKind;
  comment?: string;
  digitalSignature: string;
}
