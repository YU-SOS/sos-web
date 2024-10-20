import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"; // Storage 모듈 추가

const firebaseConfig = {
    apiKey: "AIzaSyCs8wSlxzP2EXajNYOGniY4mjy-43YKYgY",
    authDomain: "sos-9dc10.firebaseapp.com",
    databaseURL: "https://sos-9dc10-default-rtdb.firebaseio.com/",
    projectId: "sos-9dc10",
    storageBucket: "sos-9dc10.appspot.com",
    messagingSenderId: "593059531697",
    appId: "1:593059531697:web:4be328dec5737c4a65cb90",
    measurementId: "G-Y82RVKEJNC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app); // Storage 초기화

export { app, storage };
