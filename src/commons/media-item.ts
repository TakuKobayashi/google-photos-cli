import { GooglePhotosMediaItem } from '../interfaces/google-photos-medias';
import axios, { AxiosResponse } from 'axios';
import fs from 'fs';

export class MediaItem {
  private mediaInfo: GooglePhotosMediaItem;
  public onDownloadProgress?: (chunk: Buffer) => void;
  public onDownloadFinish?: () => void;
  public onDownloadFileClose?: () => void;
  public onDownloadError?: (err: Error) => void;

  constructor(info: GooglePhotosMediaItem) {
    this.mediaInfo = info;
  }

  getDownloadUrl(): string {
    if (this.mediaInfo.mimeType.includes('image')) {
      return [this.mediaInfo.baseUrl, [`w${this.mediaInfo.mediaMetadata.width}`, `h${this.mediaInfo.mediaMetadata.width}`].join('-')].join(
        '=',
      );
    } else if (this.mediaInfo.mimeType.includes('video')) {
      return [this.mediaInfo.baseUrl, 'dv'].join('=');
    } else {
      return this.mediaInfo.baseUrl;
    }
  }

  async downloadAndSaveFileStream(): Promise<void> {
    const response = await this.downloadFileStream();
    const writer = fs.createWriteStream(['exports', this.mediaInfo.filename].join('/'));
    const dataStream = response.data;
    dataStream.pipe(writer);
    //    console.log(`length:${response.headers['content-length']}`)
    if(this.onDownloadProgress){
      dataStream.on('data', this.onDownloadProgress);
    }
    if (this.onDownloadFinish) {
      writer.on('finish', this.onDownloadFinish);
    }
    if (this.onDownloadFileClose) {
      writer.on('close', this.onDownloadFileClose);
    }
    writer.on('error', (err) => {
      writer.close();
      if (this.onDownloadError) {
        this.onDownloadError(err);
      }
    });
  }

  async downloadFileStream(): Promise<AxiosResponse<any, any>> {
    return axios.get(this.getDownloadUrl(), { responseType: 'stream' });
  }
}
