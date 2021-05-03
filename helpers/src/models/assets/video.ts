import { SGMBaseAsset } from "./base-asset";


interface _BaseVideo extends SGMBaseAsset {
    width: number;
    height: number;
    length: number;
}

export interface SGMVideo extends _BaseVideo { }