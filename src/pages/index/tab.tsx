import Taro, { Component } from '@tarojs/taro';
import { View, Label, Image } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';
import { AtActivityIndicator } from 'taro-ui';
import { Business, IBusinessProps } from '../../business';

@inject(Business)
@observer
class Tab extends Component<ITabWrapperProps> {

  static options = {
    addGlobalClass: true
  }

  componentDidMount() {
    const { getVideoList, typeId = 0 } = this.props;
    getVideoList({ typeId: typeId });
  }

  render() {
    const { getAlbumListByType, typeId = 0 } = this.props;
    const list = getAlbumListByType(typeId).map(album => ({
      id: album.vod_id,
      image: album.vod_pic,
      info: album.vod_continu,
      title: album.vod_name,
    }));
    return list.length>0 ? <View className='at-row at-row--wrap album-container'>
      {list.map(item => <View className='album-pic at-col at-col-4' key={item.id} onClick={() => Taro.navigateTo({
        url: `/pages/play?id=${item.id}`,
      })}>
          <View className='album-pic-image'>
            <Image mode="aspectFill" src={item.image} lazyLoad />
            {item.info && <View className="album-pic-info">{item.info}</View>}
          </View>
          <Label>{item.title}</Label>
        </View>)}
    </View> : <View className='page'>
    <AtActivityIndicator size={60} color='#fff' mode='center' />
    </View>;
  }
}
export default Tab;

interface ITabWrapperProps extends Partial<IBusinessProps> {
  typeId?: number;
}