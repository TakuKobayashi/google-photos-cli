import axios from 'axios';
//import * as Photos from 'googlephotos';
const Photos = require('googlephotos');

export async function download(options: any): Promise<void> {
  console.log(['test'].join(','));
}

async function loadPhotos(accessToken: string) {
  const photos = new Photos(accessToken);

  // pageSizeはMax 100件
  // 詳しくはこちら: https://developers.google.com/photos/library/reference/rest/v1/mediaItems/list
  // photos.transportでhttps://photoslibrary.googleapis.com/のエンドポイントにリクエストを投げるという意味、引数はエンドポイントにくっつける文字列
  const photosResponse = await photos.transport.get('v1/mediaItems', { pageSize: 100 });

  return photosResponse.mediaItems;
}
