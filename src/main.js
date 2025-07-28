import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// 重置样式
import './style/reset.css';
// 全局样式
import './style/global.less';
import './style/style.css';

// Element UI 组件
import {
  Container,
  Header,
  Input,
  Aside,
  Menu,
  MenuItem,
  Badge,
  Main,
  Loading,
  Carousel,
  CarouselItem,
  Scrollbar,
  Footer,
  Image,
  Drawer,
  InfiniteScroll,
  Option,
  Select,
  Switch,
  Message,
  MessageBox,
  Button,
} from 'element-ui';

// 将 Message 和 Confirm 挂载到 Vue 实例上
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;

// Element UI 样式
import 'element-ui/lib/theme-chalk/index.css';

// 图标样式
import './assets/iconFont/iconfont.css';

// 注册 Element UI 组件
Vue.use(Container);
Vue.use(Header);
Vue.use(Input);
Vue.use(Aside);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Badge);
Vue.use(Main);
Vue.use(Loading);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Scrollbar);
Vue.use(Footer);
Vue.use(Image);
Vue.use(Drawer);
Vue.use(InfiniteScroll);
Vue.use(Option);
Vue.use(Select);
Vue.use(Switch);
Vue.use(Button);

// 自定义组件
import Retry from './components/Retry.vue';
Vue.component('Retry', Retry);

// Axios 配置
import axios from 'axios';
axios.defaults.baseURL = 'https://wymusicapi.aprp.cn:53333/';
Vue.prototype.$http = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');