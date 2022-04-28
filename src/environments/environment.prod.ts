const baseUrl = 'https://www.caposgt.com/';
export const environment = {
  production: true,
  staging: false,
  appVersion: '1.0.1',
  appTitle: 'CaPOS',
  serverUrl: baseUrl,
  apiUrl: baseUrl + 'api/',    
  baseUrl: baseUrl,
  paypal: {
    clientId: 'Ab0h1u-8-t5RBN4KRL8u2Nt1tT-1F2WPR_VzUEdI3iEcMFoSmFj4ustyZsAwUD8vleuXtWnpMTTOyAFp',
    secret: 'EBehWI0LXaXqEP1DdoSvS0BOwVs8T2z0cKQDJWBfwLW6829B1XtaWaUFywnVgeroAUlFGnKEkaoVZhfM'
  },
  plans:{
    free: '',
    starter: 'P-7PH38280A8086220HMDHIV3I',
    advanced: 'P-1DY470871V6943707MDHIWDA',
    multi_outlet: 'P-7N499283PH6522102MDHIWTY'
  }
};
