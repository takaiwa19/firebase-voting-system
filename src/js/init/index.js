import buildVotingSystem from '../modules/common/buildVotingSystem';
const firebase = require('firebase');

export default function() {
  // // Initialize Firebase
  // const config = {
  //   apiKey: "AIzaSyA0UBBw5hl3RBRYOQ622COuiD2jDDOkiVc",
  //   authDomain: "fir-voting-system.firebaseapp.com",
  //   databaseURL: "https://fir-voting-system.firebaseio.com",
  //   projectId: "fir-voting-system",
  //   storageBucket: "fir-voting-system.appspot.com",
  //   messagingSenderId: "778130169047"
  // };
  // firebase.initializeApp(config);
  //
  // const database = firebase.database();
  //
  // function writeNewPost( venusNum, honeyNum, matildaNum, lovelyNum ) {
  //   // A post entry.
  //   var postData = {
  //     venus: venusNum,
  //     honey: honeyNum,
  //     matilda: matildaNum,
  //     lovely: lovelyNum
  //   };
  //
  //   var updates = {};
  //   updates['/songs/'] = postData;
  //
  //   return firebase.database().ref().update(updates);
  // }
  //
  // writeNewPost(0, 0, 0, 0);

  buildVotingSystem();
};
