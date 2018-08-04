import firebase from 'firebase'
import 'firebase/firestore'

// Initialize Firebase
let firebase_config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
};
let fire = firebase.initializeApp(firebase_config);

const settings = {timestampsInSnapshots: true};
fire.firestore().settings(settings);

fire.firestore().enablePersistence()
  .then(() => {
    // Initialize Cloud Firestore through firebase
    fire.firestore();
  })
  .catch((error) => {
    if (error.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
    } else if (error.code === 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
    }
  });

export default fire;

export const firebaseAuth = fire.auth();

export const facebookProvider = new firebase.auth.FacebookAuthProvider();

export const googleProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = fire.firestore();