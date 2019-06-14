import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';
import { AtTabs, AtTabsPane } from 'taro-ui';
import New from './tabs/new';

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
  }

  state = {
    current: 0
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
    const tabList = [{ title: '最新' }]
    return (<View style='background: #21353D;'>
      <AtTabs  current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
        <AtTabsPane current={this.state.current} index={0} >
          <New />
        </AtTabsPane>
      </AtTabs>
      <View onClick={() => Taro.navigateTo({url: '/pages/search' })} className='at-icon at-icon-search video-search-icon'></View>
    </View>
    )
  }
}

export default Index;