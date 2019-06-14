import { observable, action, runInAction } from 'mobx';
import { http, Q } from '../lib';
import LoadingData from "./loadingData";

class Store {

  @observable
  albumList: LoadingData<IAlbum[]> = new LoadingData([]);

  @observable
  searchAlbumList: LoadingData<IAlbum[]> = new LoadingData([]);

  @action
  async getVideoList(param?: IQueryParam) {
    const data = await this.api().getVideoList(param);
    runInAction(() => {
      this.albumList.setLoadedData(data.data ? data.data.filter(album => album.vod_name.indexOf('性爱') === -1) : []);
    });
  }

  @action
  async fetchVideoList(param?: IQueryParam) {
    const promise = this.api().getVideoList(param);
    const result = await promise;
    runInAction(() => {
      this.searchAlbumList.setLoadedData(result.data || []);
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