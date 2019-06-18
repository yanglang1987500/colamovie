import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';
import { AtActivityIndicator, AtInput, AtCard, AtTag  } from 'taro-ui';
import { Business, IBusinessProps } from '../business';
import { string } from 'prop-types';

const hots = ['神盾局特工', '进击的巨人'];
const HISTORY_KEY = 'colakeywords';

@inject(Business)
@observer
class Search extends Component<IBusinessProps, ISearchStates> {
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
    navigationBarTitleText: '搜索',
  }
  state: ISearchStates = {
    keyword: '',
    loading: false,
    albumList: [],
  };


  saveKeywordsToHistory(keyword: string) {
    const list = Taro.getStorageSync(HISTORY_KEY) || [];
    list.push(keyword);
    const set = new Set(list);
    Taro.setStorageSync(HISTORY_KEY, Array.from(set));
  }

  readKeywordsFromHistory(): string[] {
    return Taro.getStorageSync(HISTORY_KEY) || [];
  }

  clearHistory = () => {
    Taro.removeStorageSync(HISTORY_KEY);
    this.forceUpdate();
  }

  doSearch = async () => {
    const keyword = this.state.keyword.trim();
    if (!keyword) return;
    this.setState({ loading: true });
    
    const { searchVideoList } = this.props;
    const result = await searchVideoList({ key: keyword });
    if (result.length === 0) {
      Taro.showToast({ title: '没有搜到结果', icon: 'none' });
      this.setState({ loading: false });
      return;
    }
    this.setState({ albumList: result || [], loading: false });
    setTimeout(() => {
      this.saveKeywordsToHistory(keyword);
    }, 1000);
  }

  render () {
    const { albumList, keyword, loading } = this.state;
    const historyKeywords = this.readKeywordsFromHistory();
    return <View className='page'>
      <View style='height: 40px; padding: 5px 5px;position:relative;'>
        <AtInput
          autoFocus
          className="form-item"
          name='search'
          onConfirm={this.doSearch}
          placeholder='请输入影片名称'
          value={keyword}
          onChange={(v:string) => { this.setState({ keyword: v }) }}
        />
        <View className="search-clear" onClick={() => this.setState({ albumList: [], keyword: '' })}>
          <View className='at-icon at-icon-close'></View>
        </View>
      </View>
      {albumList.length > 0 ? <View style='margin-top:20px'>
        {albumList.map(album => <AtCard
          key={album.vod_id}
          onClick={() => { Taro.navigateTo({ url: `/pages/play?id=${album.vod_id}` })}}
          className="search-card"
          title={album.vod_name}
        >
          <View className='video-desc'>
            <Image mode="aspectFill" src={album.vod_pic}  />
            <View className="video-msg">
              <View>{album.vod_name}</View>
              <View>{album.vod_continu}</View>
              <View className="line-limit album-content">{album.vod_content}</View>
            </View>
          </View>
        </AtCard>)}
      </View> : <View className="search-suggestion">
          <View className="search-type">热门搜索：</View>
          <View>{hots.map(str => <AtTag key={str} circle onClick={() => {this.setState({ keyword: str }, this.doSearch)}}>
              {str}
            </AtTag>)}
          </View>
          <View className="search-type">历史搜索：
            <View onClick={this.clearHistory} style='color:#B3E7FF;font-size:12px;margin-left:20px;float:right;'>清空历史</View>
          </View>
          <View>{historyKeywords.map(str => <AtTag key={str} circle onClick={() => {this.setState({ keyword: str }, this.doSearch)}}>
              {str}
            </AtTag>)}
          </View>
      </View>}
      {loading && <View className='globalmask'><AtActivityIndicator size={60} color='#fff' mode='center' /></View>}
    </View>;
  }
}

interface ISearchStates {
  keyword: string;
  loading: boolean;
  albumList: IAlbum[];
}


export default Search;