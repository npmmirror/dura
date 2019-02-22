import Taro, { Component, Config } from "@tarojs/taro";
import { View, Button, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { RootState, reducerRunner, effectRunner } from "../../store/index";
import "./index.scss";

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

function mapState(state: RootState) {
  return {
    count: state.count.count || 0,
    loading: state.loading.count.onAsyncChangeCount
  };
}

function mapDispatch() {
  return {
    onPlus() {
      reducerRunner.count.onChangeCount({ count: 1 });
    },
    onMin() {
      reducerRunner.count.onChangeCount({ count: -1 });
    },
    onAsyncPlus() {
      effectRunner.count.onAsyncChangeCount({ count: 1 }, { loading: true });
    }
  };
}

class Index extends Component {
  props: Readonly<Partial<ReturnType<typeof mapState>>> & Readonly<Partial<ReturnType<typeof mapDispatch>>>;

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle:1 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: "首页"
  };

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    console.log(this.props);

    return (
      <View className="index">
        <Button className="add_btn" onClick={this.props.onPlus}>
          +
        </Button>
        <Button className="dec_btn" onClick={this.props.onMin}>
          -
        </Button>
        <Button className="dec_btn" loading={this.props.loading} onClick={this.props.onAsyncPlus}>
          async
        </Button>
        <View>
          <Text>{this.props.count}</Text>
        </View>
        <View>
          <Text>Hello, World</Text>
        </View>
      </View>
    );
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default connect(
  mapState,
  mapDispatch
)(Index);
