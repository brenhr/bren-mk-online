export const environment = {
  production: false,
  firebase: {
  	apiKey: "AIzaSyAbNhQUFPwMXf5iGT-BJl-H6Do7S4BJsMQ",
    authDomain: "bren-mk-online.firebaseapp.com",
    databaseURL: "https://bren-mk-online-default-rtdb.firebaseio.com",
    projectId: "bren-mk-online",
    storageBucket: "bren-mk-online.appspot.com",
    messagingSenderId: "1088949012707",
    appId: "1:1088949012707:web:e720d2307f2567b7141dd6",
    measurementId: "G-JWMGKYDJTV"
  },
  endpoints: {
    signUp: "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=",
    verifyEmail: "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key="
  },
  assets: {
    defaultProfilePicture: "https://firebasestorage.googleapis.com/v0/b/bren-mk-online.appspot.com/o/assets%2Fprofile-default.png?alt=media&token=5a9b8d37-1ebd-4ba3-907f-c5e35a3e0b0b"
  }
};