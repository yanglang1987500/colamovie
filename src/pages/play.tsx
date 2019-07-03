import Taro, { Component, Config } from '@tarojs/taro'
import { View, Video, Image } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';
import { AtActivityIndicator, AtTag } from 'taro-ui';
import { Business, IBusinessProps } from '../business'
import { throttle, getVideoTitle } from '../lib';
import { history } from '../lib/history';
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
    videoList: [],
  };

  componentWillMount () {
  }

  componentDidMount () {
    Taro.removeStorageSync(PROGRESS_KEY);
    const { getAlbumById, getVideoByVodIdAndVodName } = this.props;
    const albumId = this.$router.params.id;
    const albumName = this.$router.params.vod_name;
    const album = getAlbumById(albumId);

    if (!album) {
      getVideoByVodIdAndVodName(albumId, albumName).then(album => {
        this.dealWithAlbumAndIndex(album);
      });
      return;
    };
    this.dealWithAlbumAndIndex(album);
  }

  componentWillUnmount () { }

  dealWithAlbumAndIndex(album: IAlbum) {
    const index = this.$router.params.index;
    Taro.setNavigationBarTitle({ title: album.vod_name });
    const videoList = this.extractVideoListFromAlbum(album);
    this.setState({
      album: album,
      current: index ? parseInt(index, 10) : 0,
      videoList: videoList.map((video, index) => ({ ...video, originIndex: index }))
    });
  }

  extractVideoListFromAlbum(album: IAlbum) {
    return album.vod_url.split('$$$')
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
  }

  onNext = () => {
    const { current, videoList } = this.state;
    this.removeProgressFromHistory();
    if (current < videoList.length - 1) {
      this.setState({ current: current + 1 });
    }
  }

  onTimeUpdate(e: BaseEventOrig<any>) {
    const { detail } = e;
    const { album, current, videoList } = this.state;
    history.updateProgressToHistory(album, current,
      detail.currentTime, videoList.find(v => v.originIndex === current).title);
  }

  removeProgressFromHistory() {
    const { album, current } = this.state;
    history.removeProgressFromHistory(album, current);
  }
  
  getProgressFromHistory() {
    const { album, current } = this.state;
    return history.getProgressFromHistory(album, current);
  }

  render () {
    const { videoList, current, album, expand, isAsc } = this.state;
    const list = isAsc ? videoList : [...videoList].reverse();
    
    return list.length > 0 ? <View className='page' style="padding-top: 245px;">
        <Video
          title={`${album.vod_name} ${videoList.find(v => v.originIndex === current).title}`}
          style='width: 100%;position:fixed;top:0;left:0;'
          src={list.find(video => video.originIndex === current).url.replace('https://', 'http://')}
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
        <View className='link-group'>
        <View className="fl link-group-item" onClick={() => {this.setState({ expand: !expand })}}>{expand ? '收起' : '展开'}</View>
        <View className="fl link-group-item" onClick={() => {this.setState({ isAsc: !isAsc })}}>{isAsc ? '倒序' : '顺序'}</View>
        </View>
        <View className={`video-desc at-row at-row--wrap choose-list ${expand ? 'expand' : ''}`}>
          <View className="choose-list-wrap">{list.map((video: IVideo) => (<AtTag
                key={video.originIndex}
                circle
                onClick={() => this.setState({ current: video.originIndex })}
                className={`choose-item ${video.originIndex == current && 'choosen'}`}
              >
              {getVideoTitle(video.title, video.originIndex)}
            </AtTag>))}
          </View>
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