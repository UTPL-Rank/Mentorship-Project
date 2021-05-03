import { SGMBaseAsset } from "./base-asset";

interface _BaseDocument extends SGMBaseAsset {
    extension: string;
    kind: 'PDF' | 'WORD' | 'EXCEL' | 'POWER_POINT' | 'DOC' | 'SHEET' | 'SLIDE';
}

export interface SGMDocument extends _BaseDocument { }