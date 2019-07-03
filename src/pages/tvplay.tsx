import Taro, { Component, Config } from '@tarojs/taro'
import { View, Video } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';
import { Business, IBusinessProps } from '../business'

@inject(Business)
@observer
class TvPlay extends Component<IBusinessProps, {}> {

  constructor(props: IBusinessProps) {
    super(props);
  }

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
    navigationBarTitleText: '',
  }

  componentDidMount() {
    const { tvData } = this.props;
    const index = this.$router.params.tvIndex;
    const tvItem = tvData[parseInt(index, 10)];
    Taro.setNavigationBarTitle({ title: tvItem.title });
  }

  render () {
    const { tvData } = this.props;
    const index = this.$router.params.tvIndex;
    const tvItem = tvData[parseInt(index, 10)];
    
    return <View className='page' style="padding-top: 245px;">
        <Video
          title={`${tvItem.title}`}
          style='width: 100%;position:fixed;top:0;left:0;'
          src={tvItem.url}
          controls={true}
          autoplay={true}
          id='video'
          loop={false}
          muted={false}
        />
    </View>;
  }
}


export default TvPlay;