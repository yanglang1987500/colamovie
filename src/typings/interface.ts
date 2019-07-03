interface IQueryParam {
  key?: string;
  pageIndex?: number;
  typeId?: number;
  vodids?: string;
}

interface IData {
  [key: number]: IAlbum[];
}

interface IAlbum {
  vod_id: string;
  vod_cid: string;
  vod_name: string;
  vod_actor: string;
  vod_director: string;
  vod_content: string;
  vod_pic: string;
  vod_area: string;
  vod_year: string;
  vod_play: string;
  vod_url: string;
  vod_continu: string;
  list_name: string;
}

interface IPage {
  pageindex: string;
  pagecount: string;
  pagesize: string;
  recordcount: string;
}

interface IType {
  list_id: number;
  list_name: string;
}

interface IResult {
  status: number;
  page: IPage;
  data: IAlbum[];
  list: IType[];
}

interface IVideo {
  title: string;
  url: string;
  originIndex?: number;
}

interface IAlbumType {
  id: number;
  name: string;
}

interface IProgresHistory {
  [key: string]: IProgress;
}

interface IProgress {
  vod_id: string;
  vod_name: string;
  vod_pic: string;
  index: number;
  time: number;
  title?: string;
  update_time: number;
}

interface IAlbumHistory {
  vod_name: string;
  update_time: number;
  vods: IProgress[];
}

interface ITV {
  title: string;
  url: string;
}