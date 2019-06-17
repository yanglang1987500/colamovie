import Store from '../store';
import LoadingData from '../store/loadingData';

export const Business = (store: Store) => {
  const propsConnect = {
    albumList: store.albumList,
    searchAlbumList: store.searchAlbumList,
    globalData: store.globalData,
  };
  const dispatchConnect = {
    getVideoList: (param?: IQueryParam) => store.getVideoList(param),
    fetchVideoList: (param?: IQueryParam) => store.fetchVideoList(param),
    getAlbumListByType: (typeId: number) => store.getAlbumListByType(typeId),
    getAlbumById: (albumId: string) => store.getAlbumById(albumId),
  };

  return {
    ...propsConnect,
    ...dispatchConnect,
  };
};

export interface IBusinessProps {
  albumList: LoadingData<IAlbum[]>;
  searchAlbumList: LoadingData<IAlbum[]>;
  globalData: LoadingData<IData>;
  getVideoList: (param?: IQueryParam) => Promise<void>;
  fetchVideoList: (param?: IQueryParam) => Promise<IResult>;
  getAlbumListByType: (typeId: number) => IAlbum[];
  getAlbumById: (albumId: string) => IAlbum,
}