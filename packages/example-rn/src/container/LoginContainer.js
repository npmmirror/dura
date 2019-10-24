"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_redux_1 = require("react-redux");
var react_native_1 = require("react-native");
var store_1 = require("../store");
var react_navigation_1 = require("react-navigation");
var lottie_react_native_1 = __importDefault(require("lottie-react-native"));
var Ionicons_1 = __importDefault(require("react-native-vector-icons/Ionicons"));
var react_native_action_button_1 = __importDefault(require("react-native-action-button"));
var react_native_2 = require("@ant-design/react-native");
function mapState(state) {
    return {
        name: state.user.name,
        loading: state.loading.user.onAsyncChangeName,
        context: state.user.context,
        isShow: state.user.isShow,
        isShowDraw: state.user.isShowDraw
    };
}
function mapDispatch(dispatch) {
    return {
        onAsyncChangeName: function () {
            dispatch(store_1.actionCreator.user.onAsyncChangeName({ newName: 'async异步张三3' }, { loading: true }));
        },
        onChangeName: function () {
            dispatch(store_1.actionCreator.user.onChangeName({ newName: '同步张三' }));
        },
        pushUserPage: function (navigation) {
            dispatch(store_1.actionCreator.router.pushUserPage({ navigation: navigation }));
        },
        onChangeContext: function (newContext) {
            dispatch(store_1.actionCreator.user.onChangeContext({ newContext: newContext }));
        },
        onHide: function () {
            dispatch(store_1.actionCreator.user.onChangeIsShow({ nextIsShow: false }));
        },
        onChangeIsShowDraw: function () {
            dispatch(store_1.actionCreator.user.onChangeIsShowDraw({ isShowDraw: true }));
        }
    };
}
var options = {
    sampleRate: 16000,
    channels: 1,
    bitsPerSample: 16,
    audioSource: 6,
    wavFile: 'test.wav' // default 'audio.wav'
};
// create a path you want to write to
// :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
// but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
var LoginContainer = /** @class */ (function (_super) {
    __extends(LoginContainer, _super);
    function LoginContainer(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            progress: new react_native_1.Animated.Value(0)
        };
        return _this;
    }
    LoginContainer.prototype.componentDidMount = function () {
        // Animated.timing(this.state.progress, {
        //   toValue: 1,
        //   duration: 500,
        //   easing: Easing.linear
        // }).start();
    };
    LoginContainer.prototype.render = function () {
        var _this = this;
        var tabs = [
            { title: '推荐' },
            { title: '我的关注' },
            { title: '中小学' },
            { title: '法律咨询' },
            { title: '心理咨询' },
            { title: '医疗咨询' },
            { title: '英语学习' },
            { title: '爱问爱答' }
        ];
        var style = react_native_1.StyleSheet.create({
            txt: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                height: 150,
                backgroundColor: '#fff'
            },
            line: { color: '#EE9611' },
            actionButtonIcon: {
                fontSize: 20,
                height: 22,
                color: 'white'
            },
            txt2: {
                width: 300,
                // borderWidth: 1,
                borderColor: '#999',
                lineHeight: 25
            }
        });
        return (<react_native_1.View style={{ flex: 1 }}>
        <react_native_2.Provider>
          <react_native_1.StatusBar hidden={this.props.isShowDraw} showHideTransition='slide' animated={true}/>
          <react_native_2.Tabs tabs={tabs} animated={true} prerenderingSiblingsNumber={2} destroyInactiveTab={false}>
            <react_native_1.View style={style.txt}>
              <react_native_1.View>
                <react_native_1.View style={{ backgroundColor: '#fff', zIndex: 999 }}>
                  <react_native_1.Text style={[style.txt2, { backgroundColor: '#fff' }]} numberOfLines={2} ellipsizeMode='clip' onLayout={function (e) {
            if (e.nativeEvent.layout.height > 25 * 3) {
                console.log('大于3行');
            }
            console.log(e.nativeEvent.layout.height);
        }}>
                    在嵌套的Text组件中，子Text组件将继承父Text组件的样式，并且只能添加父Text组件没有指定的样式，不能覆盖父Text组件的样式。如果试图在代码中覆盖父Text组件继承来的样式，覆盖将不会生效。Ps：嵌套Text组件的显示字符串中，需要另起一行需要在字符串前添加
                    {'\r\n'}，否则将接着上一行继续显示 ————————————————
                  </react_native_1.Text>
                </react_native_1.View>
                <react_native_1.View style={{ justifyContent: 'flex-start', flexDirection: 'row' }}>
                  <react_native_1.Text style={[
            style.txt2,
            {
                marginTop: -50,
                marginLeft: -20,
                width: 300
            }
        ]} numberOfLines={3} onLayout={function (e) {
            if (e.nativeEvent.layout.height > 25 * 3) {
                console.log('大于3行');
            }
            console.log(e.nativeEvent.layout.height);
        }}>
                    在嵌套的Text组件中，子Text组件将继承父Text组件的样式，并且只能添加父Text组件没有指定的样式，不能覆盖父Text组件的样式。如果试图在代码中覆盖父Text组件继承来的样式，覆盖将不会生效。Ps：嵌套Text组件的显示字符串中，需要另起一行需要在字符串前添加
                    {'\r\n'}，否则将接着上一行继续显示 ————————————————
                  </react_native_1.Text>
                  <react_native_1.Text style={{ lineHeight: 25, color: 'blue' }}>全文</react_native_1.Text>
                </react_native_1.View>
              </react_native_1.View>

              <lottie_react_native_1.default 
        // progress={this.state.progress}
        ref={function (animation) {
            _this.animation = animation;
        }} loop={true} autoPlay={true} source={require('../json/data.json')}></lottie_react_native_1.default>
              <react_native_1.Text>hello</react_native_1.Text>
              <react_native_1.View style={{ marginTop: 200, padding: 8 }}>
                <react_native_2.Button type='primary' onPress={function () {
            // this.animation.play();
            // this.props.onChangeIsShowDraw();
            _this.props.navigation.openDrawer();
        }}>
                  打开侧滑面板
                </react_native_2.Button>
                <react_native_2.WhiteSpace />
              </react_native_1.View>
            </react_native_1.View>
            <react_native_1.View style={style.txt}>
              <react_native_1.Text>我的关注</react_native_1.Text>
              <react_native_action_button_1.default buttonColor='rgba(231,76,60,1)'>
                <react_native_action_button_1.default.Item buttonColor='#9b59b6' title='New Task' onPress={function () { return console.log('notes tapped!'); }}>
                  <Ionicons_1.default name='md-create' style={style.actionButtonIcon}/>
                </react_native_action_button_1.default.Item>
                <react_native_action_button_1.default.Item buttonColor='#3498db' title='Notifications' onPress={function () { }}>
                  <Ionicons_1.default name='md-notifications-off' style={style.actionButtonIcon}/>
                </react_native_action_button_1.default.Item>
                <react_native_action_button_1.default.Item buttonColor='#1abc9c' title='All Tasks' onPress={function () { }}>
                  <Ionicons_1.default name='md-done-all' style={style.actionButtonIcon}/>
                </react_native_action_button_1.default.Item>
              </react_native_action_button_1.default>
            </react_native_1.View>
            <react_native_1.View style={style.txt}>
              <react_native_1.Text>中小学</react_native_1.Text>
            </react_native_1.View>
            <react_native_1.View style={style.txt}>
              <react_native_2.Button type='primary' onPress={function () {
            var BUTTONS = [
                'Operation1',
                'Operation2',
                'Operation3',
                'Delete',
                'Cancel'
            ];
            react_native_2.ActionSheet.showActionSheetWithOptions({
                title: 'Title',
                message: 'Description',
                options: BUTTONS,
                cancelButtonIndex: 4,
                destructiveButtonIndex: 3
            }, function (buttonIndex) {
                _this.setState({ clicked: BUTTONS[buttonIndex] });
            });
        }}>
                打开底部弹层
              </react_native_2.Button>
            </react_native_1.View>
            <react_native_1.View style={style.txt}>
              <react_native_1.Text>心理咨询</react_native_1.Text>
            </react_native_1.View>
            <react_native_1.View style={style.txt}>
              <react_native_1.Text>医疗咨询</react_native_1.Text>
            </react_native_1.View>
            <react_native_1.View style={style.txt}>
              <react_native_1.Text>英语学习</react_native_1.Text>
            </react_native_1.View>
            <react_native_1.View style={style.txt}>
              <react_native_1.Text>爱问爱答</react_native_1.Text>
            </react_native_1.View>
          </react_native_2.Tabs>
        </react_native_2.Provider>
      </react_native_1.View>);
    };
    return LoginContainer;
}(react_1.Component));
exports.default = react_navigation_1.createBottomTabNavigator({
    Home: react_redux_1.connect(mapState, mapDispatch)(LoginContainer),
    Own: function () {
        var _this = this;
        var style = react_native_1.StyleSheet.create({
            txt: {
                alignItems: 'center',
                justifyContent: 'center',
                height: 150,
                backgroundColor: '#fff'
            }
        });
        return (<react_native_1.View style={style.txt}>
        <lottie_react_native_1.default ref={function (animation) {
            _this.animation = animation;
        }} autoPlay={true} source={require('../json/data.json')}></lottie_react_native_1.default>
        <react_native_1.Text>Content of First Tab</react_native_1.Text>
      </react_native_1.View>);
    }
});
//# sourceMappingURL=LoginContainer.js.map