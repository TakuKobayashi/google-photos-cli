import { LoginTokens } from '../commons/login-tokens';
import { MediaItem } from '../commons/media-item';
import fs from 'fs';
import { GooglePhotosMediaItemList } from '../interfaces/google-photos-api-response';
import { DownloadCommandOptions } from '../interfaces/command-options';
const Photos = require('googlephotos');

const loadApiPageSize = 100;

export async function download(options: DownloadCommandOptions): Promise<void> {
  const tokens = LoginTokens.getInstance().load();
  const photos = new Photos(tokens.access_token);
  fs.mkdirSync(options.project, { recursive: true });

  // pageSizeはMax 100件
  // 詳しくはこちら: https://developers.google.com/photos/library/reference/rest/v1/mediaItems/list
  // photos.transportでhttps://photoslibrary.googleapis.com/のエンドポイントにリクエストを投げるという意味、引数はエンドポイントにくっつける文字列
  let nextPageToken: string | undefined = undefined;
  do {
    const requestObj: { [s: string]: any } = { pageSize: loadApiPageSize };
    if (nextPageToken) {
      requestObj.pageToken = nextPageToken;
    }
    const photosResponse = (await photos.transport.get('v1/mediaItems', requestObj)) as GooglePhotosMediaItemList;
    for (const mediaItem of photosResponse.mediaItems) {
      const item = new MediaItem(mediaItem);
      item.downloadAndSaveFileStream();
    }
    nextPageToken = photosResponse.nextPageToken;
  } while (nextPageToken);
}
