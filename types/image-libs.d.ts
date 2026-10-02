declare module "imagetracerjs" {
  const ImageTracer: {
    imagedataToSVG: (
      imageData: ImageData,
      options?: Record<string, number | string | boolean>,
    ) => string;
  };
  export default ImageTracer;
}

declare module "utif" {
  interface IFD {
    width: number;
    height: number;
    data?: Uint8Array;
  }

  export function decode(buffer: ArrayBuffer): IFD[];
  export function decodeImage(buffer: ArrayBuffer, ifd: IFD): void;
  export function toRGBA8(ifd: IFD): Uint8Array;
}
