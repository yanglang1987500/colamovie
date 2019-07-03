import Taro, { Component } from '@tarojs/taro';
import { View, Label, Image } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';
import { Business, IBusinessProps } from '../../../business';

@inject(Business)
@observer
class Types extends Component<ITypeWrapperProps> {

  static options = {
    addGlobalClass: true
  }

  componentDidMount() {
    Taro.setNavigationBarTitle({ title: '电视台列表' });
  }

  render() {
    const { tvData } = this.props;
    return <View className='at-row at-row--wrap types-container'>
      {tvData.map((item, index) => <View className='types-metro at-col at-col-4' key={item.title} onClick={() => Taro.navigateTo({
        url: `/pages/tvplay?tvIndex=${index}`,
      })}>
          <Label>{item.title}</Label>
        </View>)}
    </View>;
  }
}
export default Types;

interface ITypeWrapperProps extends Partial<IBusinessProps> {
}