import Taro, { Component, Config } from '@tarojs/taro';
import { View, Label, Image } from '@tarojs/components';
import * as _ from 'lodash';
import { AtCard } from 'taro-ui';
import { history } from '../../../lib/history';

class Mine extends Component<ITypeWrapperProps, ITypeWrapperStates> {

  static options = {
    addGlobalClass: true
  }
  state: ITypeWrapperStates = {
    historyProgress: []
  }

  componentDidMount() {
    Taro.setNavigationBarTitle({ title: '观看记录' });
    const data: IProgresHistory = history.getAllProgressFromHistory();
    const list: IProgress[] = Object.keys(data).map(key => data[key]);
    this.setState({
      historyProgress: list
    });
  }

  removeHistory(vod_id: string, index: number) {
    const { historyProgress } = this.state;
    history.removeProgressFromHistory({ vod_id }, index);
    this.setState({
      historyProgress: historyProgress
        .filter(progress => !(progress.index === index && progress.vod_id === vod_id))
    });
  }

  goToPlay(vod_id: string, index: number){
    Taro.navigateTo({
      url: `/pages/play?id=${vod_id}&index=${index}`,
    });
  }

  render() {
    const { historyProgress } = this.state;
    const list = _.groupBy(historyProgress, 'vod_name');
  
    return <View>
      {Object.keys(list).length > 0 ? Object.keys(list).map((vod_name: string) => <View>
        <View style='padding:0 5px 0 0;color:#eee;margin-left:10px;border-bottom: 1px solid #eee;display:inline-block;'>{vod_name}</View>
        <View className='at-row at-row--wrap album-container'>{
          list[vod_name].map(progress => <View
            className='album-pic at-col at-col-4'
            key={`${progress.vod_id}${progress.index}`}
            onClick={this.goToPlay.bind(this, progress.vod_id, progress.index)}>
              <View className='album-pic-image'>
                <Image mode="aspectFill" src={progress.vod_pic} lazyLoad />
               <View className="album-pic-action"
                  onClick={(e) => {
                    this.removeHistory(progress.vod_id, progress.index);
                    e.stopPropagation();
                  }}>删除</View>
                <View className="album-pic-info">{history.sec_to_time(progress.time)}</View>
              </View>
              <Label>{progress.title}</Label>
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
}