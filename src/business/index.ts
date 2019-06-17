import Store from '../store';
import LoadingData from '../store/loadingData';

export const Business = (store: Store) => {
  const propsConnect = {
    albumList: store.albumList,
    searchAlbumList: store.searchAlbumList,
    globalData: store.globalData,
    typeList: store.typeList,
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
  typeList: LoadingData<IType[]>;
  globalData: LoadingData<Map<number, LoadingData<IAlbum[]>>>;
  getVideoList: (param?: IQueryParam) => Promise<void>;
  fetchVideoList: (param?: IQueryParam) => Promise<IResult>;
  getAlbumListByType: (typeId: number) => LoadingData<IAlbum[]>;
  getAlbumById: (albumId: string) => IAlbum,
}