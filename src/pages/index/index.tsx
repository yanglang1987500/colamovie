import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';
import { AtTabBar } from 'taro-ui';
import New from './tabs/new';
import Types from './tabs/types';
import Mime from './tabs/mime';

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
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 3000);
  }
  onReachBottom() {
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
    const { current } = this.state;
    return (<View className='page'>
        {current === 0 && <New />}
        {current === 1 && <Types />}
        {current === 2 && <Mime />}
        <AtTabBar
          fixed
          className="bottom-tabbar"
          tabList={[
            { title: '最新' },
            { title: '分类' },
            { title: '观看记录', dot: true }
          ]}
          onClick={this.handleClick.bind(this)}
          current={this.state.current}
        />
        <View onClick={() => Taro.navigateTo({url: '/pages/search' })} className='at-icon at-icon-search video-search-icon' />
    </View>
    )
  }
}

export default Index;