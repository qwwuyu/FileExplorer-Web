import ReactDOM from 'react-dom';

import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

import { Provider } from 'react-redux';
import { store } from '@redux/store';

import App from './App';
import { PageWrapper } from './PageWrapper';
import { initData } from './appTheme';

// import './mock'; //开启mock模拟数据,开启后setupProxy.js不生效

const antdConfig = {
  locale: zhCN,
};

initData();

ReactDOM.render(
  <ConfigProvider {...antdConfig}>
    <Provider store={store}>
      <PageWrapper>
        <App />
      </PageWrapper>
    </Provider>
  </ConfigProvider>,
  document.getElementById('root')
);
