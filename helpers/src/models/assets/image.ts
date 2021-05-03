import { SGMBaseAsset } from "./base-asset";


interface _BaseImage extends SGMBaseAsset {
    width: number;
    height: number;
}

export interface SGMImage extends _BaseImage {
    optimized: {
        small?: _BaseImage;
        original: _BaseImage;
    }
}