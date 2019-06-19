import Taro, { Component, Config } from '@tarojs/taro';
import { View, Label, Image } from '@tarojs/components';
import * as _ from 'lodash';
import { AtCard } from 'taro-ui';
import { history } from '../../../lib/history';
import { ITouchEvent } from '@tarojs/components/types/common';

class Mine extends Component<ITypeWrapperProps, ITypeWrapperStates> {

  static options = {
    addGlobalClass: true
  }
  state: ITypeWrapperStates = {
    historyProgress: [],
    action: 'read'
  }

  componentDidMount() {
    Taro.setNavigationBarTitle({ title: '观看记录' });
    const data: IProgresHistory = history.getAllProgressFromHistory();
    const list: IProgress[] = Object.keys(data).map(key => data[key]);
    this.setState({
      historyProgress: list
    });
  }

  removeHistory(vod_id: string, index: number, e: ITouchEvent) {
    const { historyProgress } = this.state;
    e.stopPropagation();
    history.removeProgressFromHistory({ vod_id }, index);
    this.setState({
      historyProgress: historyProgress
        .filter(progress => !(progress.index === index && progress.vod_id === vod_id))
    });
  }

  goToPlay(vod_id: string, index: number, vod_name: string){
    Taro.navigateTo({
      url: `/pages/play?id=${vod_id}&index=${index}&vod_name=${vod_name}`,
    });
  }

  toggleAction() {
    const { action } = this.state;
    this.setState({ action: action === 'edit' ? 'read' : 'edit' });
  }

  render() {
    const { historyProgress, action } = this.state;
    const list = _.groupBy(historyProgress, 'vod_name');
    const result = Object.keys(list).map((vod_name: string): IAlbumHistory => {
      return {
        vod_name,
        update_time: Math.max.apply(Math, list[vod_name].map(function(o) {return o.update_time})),
        vods: list[vod_name]
      }
    }).sort((a, b) => (b.update_time - a.update_time));
    return <View>
      <View className="history_action_button" onClick={this.toggleAction}>{action === 'read' ? '操作' : '完成'}</View>
      {result.length > 0 ? result.map((album: IAlbumHistory) => <View>
        <View className='history_album_title'>
          {decodeURIComponent(album.vod_name)}
        </View>
        <View className='video-history at-row at-row--wrap album-container'>{
          album.vods.map(progress => <View
            className='album-pic at-col at-col-3'
            key={`${progress.vod_id}${progress.index}`}
            onClick={this.goToPlay.bind(this, progress.vod_id, progress.index, progress.vod_name)}>
              <View className='album-pic-image'>
                <Image mode="aspectFill" src={progress.vod_pic} lazyLoad />
               <View className={`album-pic-action ${action === 'edit' ? 'show' : ''}`}
                  onClick={this.removeHistory.bind(this, progress.vod_id, progress.index)}>删除</View>
                <View className="album-pic-info">{history.sec_to_time(progress.time)}</View>
              </View>
              <Label>{decodeURIComponent(progress.title)}</Label>
            </View>)
        }
      </View></View>) : <View className="no-data">没有数据~</View>}
    </View>;
  }
}
export default Mine;

interface ITypeWrapperProps {}
interface ITypeWrapperStates {
  historyProgress: IProgress[];
  action: 'edit' | 'read';
}