import axios from 'axios';
import { LoginTokens } from '../commons/login-tokens';
import { MediaItem } from '../commons/media-item';
import fs from 'fs';
import { GooglePhotosMediaItemList } from '../interfaces/google-photos-api-response';
const Photos = require('googlephotos');

export async function download(options: any): Promise<void> {
  const tokens = LoginTokens.getInstance().load();
  const photos = new Photos(tokens.access_token);

  // pageSizeはMax 100件
  // 詳しくはこちら: https://developers.google.com/photos/library/reference/rest/v1/mediaItems/list
  // photos.transportでhttps://photoslibrary.googleapis.com/のエンドポイントにリクエストを投げるという意味、引数はエンドポイントにくっつける文字列
  const photosResponse = (await photos.transport.get('v1/mediaItems', { pageSize: 100 })) as GooglePhotosMediaItemList;
  console.log(JSON.stringify(photosResponse, null, 2));
  fs.mkdirSync('exports', { recursive: true });
  for (const mediaItem of photosResponse.mediaItems) {
    const item = new MediaItem(mediaItem);
    item.downloadAndSaveFileStream();
  }
}
