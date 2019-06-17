import { observable, action, runInAction, toJS } from 'mobx';
import { http, Q } from '../lib';
import LoadingData from "./loadingData";
import { filterChar, filterSensitive } from '../lib/filter';
import { albumType, albumTypes } from '../lib/constants';

const emptyData = new LoadingData<IAlbum[]>([]);
class Store {

  @observable
  globalData: LoadingData<Map<number, LoadingData<IAlbum[]>>> =
    new LoadingData(Array(100).fill(1)
      .reduce((map, v, currentIndex) => (map[currentIndex] = new LoadingData<IAlbum[]>([])), new Map()));

  @observable
  albumList: LoadingData<IAlbum[]> = new LoadingData([]);

  @observable
  searchAlbumList: LoadingData<IAlbum[]> = new LoadingData([]);

  @observable
  typeList: LoadingData<IType[]> = new LoadingData([]);

  getAlbumListByType(typeId: number) :LoadingData<IAlbum[]> {
    return this.globalData.data.get(typeId);
  }

  getAlbumById(albumId: string) {
    const data = this.globalData.data;
    return Object.keys(data)
      .reduce((prev: [], current: string) => [...prev, ...data.get(parseInt(current, 10)).data], [])
      .concat(toJS(this.searchAlbumList.data))
      .find((album: IAlbum) => album.vod_id == albumId);
  }

  @action
  async getVideoList(param?: IQueryParam) {
    const result = await this.api().getVideoList(param);
    runInAction(() => {
      let list = result.data;
      this.setTypeList(result.list);
      list = filterSensitive(list, (album) => album.vod_name);
      list = filterChar(list, 'vod_content');
      const data = this.globalData.data;
      data.set((param && param.typeId) || albumType.News, new LoadingData(list));
      this.globalData.setLoadedData(data);
    });
  }

  @action
  setTypeList(list: IType[]) {
    this.typeList.setLoadedData(list);
  }

  @action
  async fetchVideoList(param?: IQueryParam) {
    const promise = this.api().getVideoList(param);
    const result = await promise;
    runInAction(() => {
      let list = result.data;
      list = filterChar(list, 'vod_content');
      this.searchAlbumList.setLoadedData(list);
    });
    return promise;
  }

  api() {
    return {
      getVideoList: (param?: IQueryParam): Promise<IResult> => {
        const searchParam: any = {};
        if (param) {
          param.key && (searchParam.wd = param.key);
          param.pageIndex && (searchParam.p = param.pageIndex);
          param.typeId && (searchParam.cid = param.typeId);
        }
        return Q(http.get('https://wx.yaoleyaotou.xin/inc/feifei3.4', searchParam));
      },
    };
  }
}

export default Store;