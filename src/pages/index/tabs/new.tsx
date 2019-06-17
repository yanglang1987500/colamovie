import Taro, { Component } from '@tarojs/taro'
import { View, Image, Label } from "@tarojs/components";
import { AtActivityIndicator } from 'taro-ui';
import { observer, inject } from '@tarojs/mobx';
import { Business, IBusinessProps } from '../../../business';
import { albumType, albumTypes } from '../../../lib/constants';

@inject(Business)
@observer
class New extends Component<INewProps, INewStates> {
  
  static options = {
    addGlobalClass: true
  }

  componentDidMount() {
    const { getVideoList } = this.props;
    getVideoList({ typeId: albumType.News });
  }

  render() {
    const { getAlbumListByType } = this.props;
    const list = getAlbumListByType(albumType.News).map(album => ({
      id: album.vod_id,
      image: album.vod_pic,
      title: album.vod_name,
    }));
    return list.length>0 ? <View className='at-row at-row--wrap album-container'>
      {list.map(item => <View className='album-pic at-col at-col-4' key={item.id} onClick={() => Taro.navigateTo({
        url: `/pages/play?id=${item.id}`,
      })}>
          <Image mode="aspectFill" src={item.image}  />
          <Label>{item.title}</Label>
        </View>)}
    </View> : <View className='page'>
    <AtActivityIndicator size={60} color='#fff' mode='center' />
    </View>;
  }
}

interface INewProps extends Partial<IBusinessProps> {
}

interface INewStates {
}

export default New;