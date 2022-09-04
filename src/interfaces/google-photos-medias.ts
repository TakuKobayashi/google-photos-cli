// See: https://developers.google.com/photos/library/reference/rest/v1/mediaItems
export interface GooglePhotosMediaItem {
  id: string;
  description?: string;
  productUrl: string;
  baseUrl: string;
  mimeType: string;
  mediaMetadata: GooglePhotosMediaMetadata;
  filename: string;
}

// See: https://developers.google.com/photos/library/reference/rest/v1/mediaItems#MediaMetadata
export interface GooglePhotosMediaMetadata {
  creationTime: string;
  width: string;
  height: string;
  photo?: GooglePhotosMediaPhoto;
  video?: GooglePhotosMediaVideo;
}

// See: https://developers.google.com/photos/library/reference/rest/v1/mediaItems#Photo
export interface GooglePhotosMediaPhoto {
  cameraMake?: string;
  cameraModel?: string;
  focalLength?: number;
  apertureFNumber?: number;
  isoEquivalent?: number;
  exposureTime?: string;
}

// See: https://developers.google.com/photos/library/reference/rest/v1/mediaItems#Video
export interface GooglePhotosMediaVideo {
  cameraMake?: string;
  cameraModel?: string;
  fps: number;
  status: GooglePhotosMediaVideoStatus;
}

// See: https://developers.google.com/photos/library/reference/rest/v1/mediaItems#VideoProcessingStatus
export enum GooglePhotosMediaVideoStatus {
  UNSPECIFIED,
  PROCESSING,
  READY,
  FAILED,
}
