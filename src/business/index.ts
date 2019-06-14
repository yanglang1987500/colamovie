import Store from '../store';
import LoadingData from '../store/loadingData';

export const Business = (store: Store) => {
  const propsConnect = {
    albumList: store.albumList,
    searchAlbumList: store.searchAlbumList,
  };
  const dispatchConnect = {
    getVideoList: (param?: IQueryParam) => store.getVideoList(param),
    fetchVideoList: (param?: IQueryParam) => store.fetchVideoList(param)
  };

  return {
    ...propsConnect,
    ...dispatchConnect,
  };
};

export interface IBusinessProps {
  albumList: LoadingData<IAlbum[]>;
  searchAlbumList: LoadingData<IAlbum[]>;
  getVideoList: (param?: IQueryParam) => Promise<void>;
  fetchVideoList: (param?: IQueryParam) => Promise<IResult>;
}