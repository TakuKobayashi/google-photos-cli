import axios from 'axios';
import { LoginTokens } from '../commons/login-tokens';
import fs from 'fs';
const Photos = require('googlephotos');

export async function download(options: any): Promise<void> {
  const tokens = LoginTokens.getInstance().load();
  const photos = new Photos(tokens.access_token);

  // pageSizeはMax 100件
  // 詳しくはこちら: https://developers.google.com/photos/library/reference/rest/v1/mediaItems/list
  // photos.transportでhttps://photoslibrary.googleapis.com/のエンドポイントにリクエストを投げるという意味、引数はエンドポイントにくっつける文字列
  const photosResponse = await photos.transport.get('v1/mediaItems', { pageSize: 100 });
  //console.log(JSON.stringify(photosResponse, null, 2));
  fs.mkdirSync('exports', { recursive: true });
  for (const mediaItem of photosResponse.mediaItems) {
    let downloadUrl = mediaItem.baseUrl
    if(mediaItem.mimeType.includes("image")){
      downloadUrl = [mediaItem.baseUrl, [`w${mediaItem.mediaMetadata.width}`, `h${mediaItem.mediaMetadata.width}`].join('-')].join('=')
    }else if(mediaItem.mimeType.includes("video")){
      downloadUrl = [mediaItem.baseUrl, "dv"].join("=")
    }
    const writer = fs.createWriteStream(['exports', mediaItem.filename].join('/'));
    const response = await axios.get(
      downloadUrl,
      { responseType: 'stream' },
    );
    const dataStream = response.data
    dataStream.pipe(writer);
    console.log(`length:${response.headers['content-length']}`)
    writer.on('error', err => {
      writer.close();
      console.log(err)
    });
    writer.on('finish', () => {
      console.log("finish")
    })
    dataStream.on('data', (chunk) => {
    })
    writer.on('close', () => {
      console.log("close")
    })
  }
}
