import Taro, { Component, Config } from '@tarojs/taro'
import { View, Video, Image } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';
import { AtActivityIndicator } from 'taro-ui';
import { Business, IBusinessProps } from '../business'
import { throttle } from '../lib';
import { BaseEventOrig } from '@tarojs/components/types/common';

const PROGRESS_KEY = 'colaprogress';

@inject(Business)
@observer
class Play extends Component<IBusinessProps, IPlayStates> {

  constructor(props: IBusinessProps) {
    super(props);
    this.onTimeUpdate = throttle(this.onTimeUpdate.bind(this), 2000);
  }

  static options = {
    addGlobalClass: true
  }
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '',
  }

  state: IPlayStates = {
    album: null,
    expand: false,
    current: 0,
    isAsc: true,
    videoList: []
  };

  componentWillMount () {
  }

  componentDidMount () {
    const { getAlbumById } = this.props;
    const albumId = this.$router.params.id;
    const album = getAlbumById(albumId);

    if (!album) return;
    Taro.setNavigationBarTitle({ title: album.vod_name });
    const videoList = album.vod_url.split('$$$')
    .map(i => i.split(/\s+/gi)
      .map(i => {
        let arr = [];
        if (i.indexOf('$') === -1) {
          arr = i.split('http');
          return {title: arr[0], url: `http${arr[1]}`};
        }
        arr = i.split('$');
        return {title: arr[0], url: arr[1]};
      })
    ).reduce((p, c) => { return p.concat(c)}, [])
    .filter(video => video.url.endsWith('m3u8'));
    this.setState({
      album: album,
      videoList: videoList.map((video, index) => ({ ...video, originIndex: index }))
    });
  }

  componentWillUnmount () { }

  onNext = () => {
    const { current, videoList } = this.state;
    if (current < videoList.length - 1) {
      this.setState({ current: current + 1 });
    }
  }

  onTimeUpdate(e: BaseEventOrig<any>) {
    const { detail } = e;
    const { album, current } = this.state;
    const progressMap = Taro.getStorageSync(PROGRESS_KEY) || {};
    progressMap[`progress_${album.vod_id}_${current}`] = detail.currentTime;
    Taro.setStorageSync(PROGRESS_KEY, progressMap);
  }
  
  getProgressFromHistory() {
    const { album, current } = this.state;
    const progressMap = Taro.getStorageSync(PROGRESS_KEY) || {};
    const progress = progressMap[`progress_${album.vod_id}_${current}`];
    return progress ? progress : 0;
  }

  render () {
    const { videoList, current, album, expand, isAsc } = this.state;
    const list = isAsc ? videoList : [...videoList].reverse();
    return list.length > 0 ? <View className='page'>
        <Video
          style='width: 100%;'
          src={list.find(video => video.originIndex === current).url}
          controls={true}
          autoplay={true}
          initialTime={this.getProgressFromHistory()}
          poster={album.vod_pic}
          id='video'
          loop={false}
          muted={false}
          onEnded={this.onNext}
          onTimeUpdate={this.onTimeUpdate}
        />
        <View className="video-desc">集数</View>
        {list.length > 10 && <View className='link-group'>
        <View className="fl link-group-item" onClick={() => {this.setState({ expand: !expand })}}>{expand ? '收起' : '展开'}</View>
        {list.length > 20 && <View className="fl link-group-item" onClick={() => {this.setState({ isAsc: !isAsc })}}>{isAsc ? '倒序' : '顺序'}</View>}
        </View>}
        <View className={`video-desc at-row at-row--wrap choose-list ${expand ? 'expand' : ''}`}>
        {list.map((video: IVideo) =>
          (<View key={video.originIndex} onClick={() => this.setState({ current: video.originIndex })} className={`at-col at-col-1 choose-item ${video.originIndex == current && 'choosen'}`}>{video.originIndex+1}</View>))}
        </View>
        <View className="video-desc">
          <Image mode="aspectFill" src={album.vod_pic}  />
        </View>
        <View className="video-desc">片名： {album.vod_name}</View>
        <View className="video-desc">导演： {album.vod_director}</View>
        <View className="video-desc">演员： {album.vod_actor}</View>
        <View className="video-desc">介绍： {album.vod_content}</View>
        <View style='height: 40px;' />
      </View> : <View className='page' style='min-height: 200px; position: relative;'>
        <AtActivityIndicator size={60} color='#fff' mode='center' />
    </View>;
  }
}

interface IPlayStates {
  current: number;
  expand: boolean;
  isAsc: boolean;
  album: IAlbum;
  videoList: IVideo[];
}


export default Play;