import Mock from 'mockjs';
import { BASE_URL } from './api';

const domain = BASE_URL;

// 模拟根目录文件列表
Mock.mock(domain + 'query', function () {
  let result =
    '{"data":[{"apk":false,"dir":true,"name":"AAAA"},{"apk":false,"dir":true,"name":"Alarms"},{"apk":false,"dir":true,"name":"Android"},{"apk":false,"dir":true,"name":"BaiduMap"},{"apk":false,"dir":true,"name":"DCIM"},{"apk":false,"dir":true,"name":"Documents"},{"apk":false,"dir":true,"name":"Download"},{"apk":false,"dir":true,"name":"Huawei"},{"apk":false,"dir":true,"name":"HuaweiWallet"},{"apk":false,"dir":true,"name":"Local"},{"apk":false,"dir":true,"name":"Movies"},{"apk":false,"dir":true,"name":"Music"},{"apk":false,"dir":true,"name":"OSSLog"},{"apk":false,"dir":true,"name":"Pictures"},{"apk":false,"dir":true,"name":"QQBrowser"},{"apk":false,"dir":true,"name":"Sounds"},{"apk":false,"dir":true,"name":"UCDownloads"},{"apk":false,"dir":true,"name":"WChat"},{"apk":false,"dir":true,"name":"aegis"},{"apk":false,"dir":true,"name":"alipay"},{"apk":false,"dir":true,"name":"amap"},{"apk":false,"dir":true,"name":"backup"},{"apk":false,"dir":true,"name":"backups"},{"apk":false,"dir":true,"name":"baidu"},{"apk":false,"dir":true,"name":"blocksampler"},{"apk":false,"dir":true,"name":"ccb"},{"apk":false,"dir":true,"name":"cmb.pb"},{"apk":false,"dir":true,"name":"com.sgcc.wsgw.cn"},{"apk":false,"dir":true,"name":"data"},{"apk":false,"dir":true,"name":"iReader"},{"apk":false,"dir":true,"name":"kgmusic"},{"apk":false,"dir":true,"name":"kugou"},{"apk":false,"dir":true,"name":"libs"},{"apk":false,"dir":true,"name":"log"},{"apk":false,"dir":true,"name":"logger"},{"apk":false,"dir":true,"name":"msc"},{"apk":false,"dir":true,"name":"sgcc"},{"apk":false,"dir":true,"name":"systemsubw"},{"apk":false,"dir":true,"name":"tencent"},{"apk":false,"dir":true,"name":"widgetone"},{"apk":false,"dir":true,"name":"wsgw_h5"},{"apk":false,"date":"2020-09-18 18:21","dir":false,"info":"42.09KB","name":"00001.vcf"},{"apk":false,"date":"2022-06-20 10:07","dir":false,"info":"32B","name":"5A968A4B377F25ED0A1FD3C67B0CEE31"}],"info":"请求成功","state":1}';
  return JSON.parse(result);
});

// 模拟根目录文件列表
Mock.mock(domain + 'note/query', function () {
  let result =
    '{"data":[{"id":36,"text":"111","time":1683795633946},{"id":39,"text":"123","time":1683797026329},{"id":41,"text":"234","time":1683798820377},{"id":42,"text":"234","time":1683798821054},{"id":44,"text":"111","time":1683798827548},{"id":47,"text":"asdasdadadad","time":1683807548163}],"info":"请求成功","state":1}';
  return JSON.parse(result);
});

export default Mock;
