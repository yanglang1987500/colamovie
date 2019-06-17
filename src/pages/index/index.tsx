import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';
import { AtTabs, AtTabsPane } from 'taro-ui';
import { albumType, albumTypes } from '../../lib/constants';
import Tab from './tab';

@observer
class Index extends Component {

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
    navigationBarTitleText: '小可乐看电影',
    enablePullDownRefresh: true,
  }

  state = {
    current: 0
  }

  onPullDownRefresh() {
    console.log('refresh???');
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 3000);
  }
  onReachBottom() {
    console.log('reach bottom');
  }

  componentWillMount () {
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleClick (value: number) {
    this.setState({
      current: value
    })
  }
  render () {
    const tabList = albumTypes.map(type => ({ title: type.name }));
    return (<View className='page'>
      <AtTabs scroll current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
        
          {albumTypes.map((type, index) => <AtTabsPane key={type.id} current={this.state.current} index={index} ><Tab typeId={type.id} /></AtTabsPane>)}
        
      </AtTabs>
      <View onClick={() => Taro.navigateTo({url: '/pages/search' })} className='at-icon at-icon-search video-search-icon'></View>
    </View>
    )
  }
}

export default Index;