import Taro, { Component } from '@tarojs/taro';
import { View, Label, Image } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';
import { AtActivityIndicator } from 'taro-ui';
import { Business, IBusinessProps } from '../../../business';

@inject(Business)
@observer
class Types extends Component<ITypeWrapperProps> {

  static options = {
    addGlobalClass: true
  }

  render() {
    const { typeList } = this.props;
    const list = typeList.data;
    return <View className='at-row at-row--wrap album-container'>
      {list.map(item => <View className='album-pic at-col at-col-4' key={item.list_id} onClick={() => Taro.navigateTo({
        url: `/pages/type?id=${item.list_id}`,
      })}>
          <Label>{item.list_name}</Label>
        </View>)}
    </View>;
  }
}
export default Types;

interface ITypeWrapperProps extends Partial<IBusinessProps> {
  typeId?: number;
}