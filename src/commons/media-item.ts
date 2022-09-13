import { GooglePhotosMediaItem } from '../interfaces/google-photos-medias';
import axios, { AxiosResponse } from 'axios';
import fs from 'fs';

export class MediaItem {
  private mediaInfo: GooglePhotosMediaItem;

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

  async download({
    projectRoot,
    onStartDownload,
    onDownloadProgress,
  }: {
    projectRoot: String;
    onStartDownload?: (totalSize: number) => void;
    onDownloadProgress?: (chunk: Buffer) => void;
  }): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.downloadAndSaveFileStream({
        projectRoot: projectRoot,
        onStartDownload: onStartDownload,
        onDownloadProgress: onDownloadProgress,
        onDownloadFileClose: () => {
          resolve();
        },
      });
    });
  }

  async downloadAndSaveFileStream({
    projectRoot,
    onStartDownload,
    onDownloadProgress,
    onDownloadFinish,
    onDownloadFileClose,
    onDownloadError,
  }: {
    projectRoot: String;
    onStartDownload?: (totalSize: number) => void;
    onDownloadProgress?: (chunk: Buffer) => void;
    onDownloadFinish?: () => void;
    onDownloadFileClose?: () => void;
    onDownloadError?: (err: Error) => void;
  }): Promise<void> {
    const response = await this.downloadFileStream();
    const writer = fs.createWriteStream([projectRoot, this.mediaInfo.filename].join('/'));
    const dataStream = response.data;
    dataStream.pipe(writer);
    const totalSize = Number(response.headers['content-length']);
    if (onStartDownload) {
      onStartDownload(totalSize);
    }
    if (onDownloadProgress) {
      dataStream.on('data', (chunk: Buffer) => {
        onDownloadProgress(chunk);
      });
    }
    if (onDownloadFinish) {
      writer.on('finish', onDownloadFinish);
    }
    if (onDownloadFileClose) {
      writer.on('close', onDownloadFileClose);
    }
    writer.on('error', (err) => {
      writer.close();
      if (onDownloadError) {
        onDownloadError(err);
      }
    });
  }

  async downloadFileStream(): Promise<AxiosResponse<any, any>> {
    return axios.get(this.getDownloadUrl(), { responseType: 'stream' });
  }
}
