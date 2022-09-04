import { GooglePhotosMediaItem } from './google-photos-medias';

export interface GooglePhotosMediaItemList {
  mediaItems: GooglePhotosMediaItem[];
  nextPageToken?: string;
}
