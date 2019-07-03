import Store from '../store';
import LoadingData from '../store/loadingData';

export const Business = (store: Store) => {
  const propsConnect = {
    albumList: store.albumList,
    searchAlbumList: store.searchAlbumList,
    globalData: store.globalData,
    typeList: store.typeList,
    tvData: store.tvData,
  };
  const dispatchConnect = {
    getVideoList: (param?: IQueryParam) => store.getVideoList(param),
    searchVideoList: (param?: IQueryParam) => store.searchVideoList(param),
    getAlbumListByType: (typeId: number) => store.getAlbumListByType(typeId),
    getAlbumById: (albumId: string) => store.getAlbumById(albumId),
    getVideoByVodIdAndVodName: (vod_id: string,  vod_name: string) =>
      store.getVideoByVodIdAndVodName(vod_id, vod_name),
  };

  return {
    ...propsConnect,
    ...dispatchConnect,
  };
};

export interface IBusinessProps {
  albumList: LoadingData<IAlbum[]>;
  searchAlbumList: LoadingData<IAlbum[]>;
  typeList: LoadingData<IType[]>;
  globalData: LoadingData<Map<number, LoadingData<IAlbum[]>>>;
  tvData: ITV[];
  getVideoList: (param?: IQueryParam) => Promise<void>;
  searchVideoList: (param?: IQueryParam) => Promise<IAlbum[]>;
  getAlbumListByType: (typeId: number) => LoadingData<IAlbum[]>;
  getAlbumById: (albumId: string) => IAlbum,
  getVideoByVodIdAndVodName: (vod_id: string, vod_name: string) => Promise<IAlbum>;
}