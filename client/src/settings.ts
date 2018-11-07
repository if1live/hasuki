export const CLIENT_ID = '976358548762-orks8af4k9h7rfpc635aqt9ma1jbtegu.apps.googleusercontent.com';
export const API_KEY = 'AIzaSyCQTem_mxhXgJdWmxcDf-J9WpZ0iyQ8dUk';

export const SHEET_ID = '1ifXQf4MeQrdytcVuvNZe42g8mRtdcg2m48A6LeEbvTI';

// TODO dns 관리 쉽게 하는 방법 뭐 없나
const API_SERVER_PROD = 'https://3vc6djd9q7.execute-api.ap-northeast-2.amazonaws.com/dev';
const API_SERVER_DEV = 'http://127.0.0.1:3100';

const getApiServer = () => {
  return process.env.NODE_ENV === 'production'
    ? API_SERVER_PROD
    : API_SERVER_DEV;
};

export const API_SERVER = getApiServer();
