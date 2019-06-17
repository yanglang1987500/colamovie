import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components';
import Tab from './index/tab';

class Type extends Component {
  
  static options = {
    addGlobalClass: true
  }
  config: Config = {
    navigationBarTitleText: '',
  }
  componentDidMount() {
    const title = this.$router.params.name;
    Taro.setNavigationBarTitle({ title });
  }
  render() {
    const list_id = parseInt(this.$router.params.id, 10);
    return <View className='page'>
      <Tab typeId={list_id} />
    </View>;
  }
}


export default Type;