import Taro, { Component } from '@tarojs/taro'
import { AtActivityIndicator } m '@tarojs/mobx';
import { View } from '@tarojs/components';
import { Business, IBusinessProps } from '../../../business';
import { albumType } from '../../../lib/constants';
import Tab from '../tab';

class New extends Component {
  
  static options = {
    addGlobalClass: true
  }

  componentDidMount() {
    Taro.setNavigationBarTitle({ title: '小可乐看电影' });
  }
  
  render() {
    return <View>
      <Tab typeId={albumType.News} />
      
    </View>;
  }
}


export default New;