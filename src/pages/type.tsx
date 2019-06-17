import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components';
import Tab from './index/tab';

class Type extends Component {
  
  static options = {
    addGlobalClass: true
  }
  config: Config = {
    navigationBarTitleText: '分类',
  }
  render() {
    const list_id = this.$router.params.id;
    return <View className='page'>
      <Tab typeId={list_id} />
    </View>;
  }
}


export default Type;