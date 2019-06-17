import { observable, action, runInAction, toJS } from 'mobx';
import { http, Q } from '../lib';
import LoadingData from "./loadingData";
import { filterChar, filterSensitive } from '../lib/filter';
import { albumType, albumTypes } from '../lib/constants';

class Store {

  @observable
  globalData: LoadingData<IData> =
    new LoadingData(albumTypes.reduce((prev: IData, current) => { prev[current.id] = []; return prev; }, {}));

  @observable
  albumList: LoadingData<IAlbum[]> = new LoadingData([]);

  @observable
  searchAlbumList: LoadingData<IAlbum[]> = new LoadingData([]);

  getAlbumListByType(typeId: number) :IAlbum[] {
    return this.globalData.data[typeId];
  }

  getAlbumById(albumId: string) {
    const data = this.globalData.data;
    return Object.keys(data)
      .reduce((prev: [], current: string) => [...prev, ...data[parseInt(current, 10)]], [])
      .concat(toJS(this.searchAlbumList.data))
      .find((album: IAlbum) => album.vod_id == albumId);
  }

  @action
  async getVideoList(param?: IQueryParam) {
    const result = await this.api().getVideoList(param);
    runInAction(() => {
      let list = result.data;
      list = filterSensitive(list, (album) => album.vod_name);
      list = filterChar(list, 'vod_content');
      const data = this.globalData.data;
      data[(param && param.typeId) || albumType.News] = list;
      this.globalData.setLoadedData(data);
    });
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
        return Q(http.get('https://wx.yaoleyaotou.xin/inc/feifei3s', searchParam));
      },
    };
  }
}

export default Store;