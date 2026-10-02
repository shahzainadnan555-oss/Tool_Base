declare module "piexifjs" {
  const piexif: {
    dump: (obj: unknown) => string;
    insert: (exif: string, jpeg: string) => string;
    ImageIFD: Record<string, number>;
  };
  export default piexif;
}

declare module "browser-image-compression" {
  interface Options {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    useWebWorker?: boolean;
    fileType?: string;
    initialQuality?: number;
  }
  export default function imageCompression(file: File, options?: Options): Promise<File>;
}
