import { observable, action, runInAction, toJS } from 'mobx';
import { http, Q } from '../lib';
import LoadingData from "./loadingData";
import { filterChar, filterSensitive } from '../lib/filter';
import { albumType, albumTypes } from '../lib/constants';

const emptyData = new LoadingData<IAlbum[]>([]);
class Store {

  constructor() {
    this.globalData = new Map<number, LoadingData<IAlbum[]>>();
    Array(100).fill(1).forEach((i, index) => {
      this.globalData.set(index, new LoadingData<IAlbum[]>([]));
    })
  }

  @observable
  globalData: Map<number, LoadingData<IAlbum[]>>;

  @observable
  albumList: LoadingData<IAlbum[]> = new LoadingData([]);

  @observable
  searchAlbumList: LoadingData<IAlbum[]> = new LoadingData([]);

  @observable
  typeList: LoadingData<IType[]> = new LoadingData([]);

  getAlbumListByType(typeId: number) :LoadingData<IAlbum[]> {
    return this.globalData.get(typeId);
  }

  getAlbumById(albumId: string) {
    const array = [];
    for (let key of this.globalData.keys()) {
      array.push(key);
    }
    return array.
      reduce((prev: [], current: number) => [...prev, ...this.globalData.get(current).data], [])
      .concat(toJS(this.searchAlbumList.data))
      .find((album: IAlbum) => album.vod_id == albumId);
  }

  @action
  async getVideoList(param?: IQueryParam) {
    const typeId = (param && param.typeId) || albumType.News;
    if (this.globalData.get(typeId).data.length > 0) {
      return;
    }
    const result = await this.api().getVideoList(param);
    runInAction(() => {
      let list = result.data;
      this.setTypeList(result.list);
      list = filterSensitive(list, (album) => album.vod_name);
      list = filterChar(list, 'vod_content');
      const typeId = (param && param.typeId) || albumType.News;
      this.globalData.get(parseInt(`${typeId}`, 10)).setLoadedData(list);
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
        return Q(http.get('https://wx.yaoleyaotou.xin/inc/feifei3.4/', searchParam));
      },
    };
  }
}

export default Store;