importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyDSzoAXm8KmN5Z8dWCVckrygK-ESDUngag",
  authDomain: "sgmentores.firebaseapp.com",
  databaseURL: "https://sgmentores.firebaseio.com",
  projectId: "sgmentores",
  storageBucket: "sgmentores.appspot.com",
  messagingSenderId: "395423068727",
  appId: "1:395423068727:web:6052e03ffd5a6ffb8d85b2",
  measurementId: "G-FKJKMMSBLH"
});

const messaging = firebase.messaging();
