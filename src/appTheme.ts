import wlog from '@src/utils/WLog';

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
}

const themeConfig = {
  primaryColor: '#50beff',
  secondaryColor: '#f8a932',
  textColorPrimary: '#222222',
  textColorRegular: '#888888',
};

export const colorAlpha = {
  10: '19',
  20: '32',
  50: '80',
  80: 'cc',
  100: 'FF',
};

export const getThemeConfig = () => themeConfig;

let appDataInited = false;
export const initData = () => {
  if (appDataInited) {
    return;
  }
  appDataInited = true;
  wlog.i('initData');
};
