const wlog = {
  i(message?: any) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(message);
    }
  },
  d(message?: any) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(message);
    }
  },
  e(message?: any) {
    console.error(message);
  },
};

Object.keys(console).forEach((k) => {
  wlog[k] = console[k];
});

export default wlog;
