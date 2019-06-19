import Taro from '@tarojs/taro';

const PROGRESS_KEY = 'cola_progress';
const PROGRESS_PREFIX = 'progress_object';

export const history = {
  /**
   * album 影片信息
   * index 第几集
   * time 需要保存的时间点
   */
  updateProgressToHistory: (album: IAlbum, index: number, time: number, title?: string) => {
    const progressMap: IProgresHistory = Taro.getStorageSync(PROGRESS_KEY) || {};
    let progress = progressMap[`${PROGRESS_PREFIX}_${album.vod_id}_${index}`];
    if (progress) {
      progress.time = time;
      progress.title = title;
    } else {
      progress = {
        vod_id: album.vod_id,
        vod_name: album.vod_name,
        vod_pic: album.vod_pic,
        index,
        time,
        title,
      };
    }
    progressMap[`${PROGRESS_PREFIX}_${album.vod_id}_${index}`] = progress;
    Taro.setStorageSync(PROGRESS_KEY, progressMap);
  },
  removeProgressFromHistory: (album: Partial<IAlbum>, index: number) => {
    const progressMap: IProgresHistory = Taro.getStorageSync(PROGRESS_KEY) || {};
    delete progressMap[`${PROGRESS_PREFIX}_${album.vod_id}_${index}`];
    Taro.setStorageSync(PROGRESS_KEY, progressMap);
  },
  getProgressFromHistory: (album: Partial<IAlbum>, index: number) => {
    const progressMap: IProgresHistory = Taro.getStorageSync(PROGRESS_KEY) || {};
    const progress = progressMap[`${PROGRESS_PREFIX}_${album.vod_id}_${index}`];
    return progress ? progress.time : 0;
  },
  getAllProgressFromHistory: (): IProgresHistory => Taro.getStorageSync(PROGRESS_KEY) || {},
  sec_to_time: (s: number) => {
    var t;
    if(s > -1){
        var hour = Math.floor(s/3600);
        var min = Math.floor(s/60) % 60;
        var sec = s % 60;
        if(hour < 10) {
            t = '0'+ hour + ":";
        } else {
            t = hour + ":";
        }

        if(min < 10){t += "0";}
        t += min + ":";
        if(sec < 10){t += "0";}
        t += Math.round(sec);
    }
    return t;
  },
};