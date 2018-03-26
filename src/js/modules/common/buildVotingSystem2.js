const Vue = require('vue/dist/vue.min');
const firebase = require('firebase');
const moment = require('moment');

export default function() {
  return new Vue({
    el: '#voting-system-2',

    data: {
      database: null,
      auth: null,
      uid: null,
      voted: null,
      count: {
        venus: 0,
        honey: 0,
        matilda: 0,
        lovely: 0
      },
      songName: {
        venus: 'VENUS',
        honey: 'HONEY',
        matilda: 'マチルダ',
        lovely: 'ラブリー'
      },
      voteData: {
        song: null,
        timeStamp: null
      },
      selected: null,
      total: 0,
    },

    mounted: function() {
      this.initFirebase();
      this.authenticate();
      this.initData();
    },

    computed: {

      getVenusWidth() {
        return 'width:' + (this.count.venus / this.total) * 100 + '%';
      },

      getHoneyWidth() {
        return 'width:' + (this.count.honey / this.total) * 100 + '%';
      },

      getMatildaWidth() {
        return 'width:' + (this.count.matilda / this.total) * 100 + '%';
      },

      getLovelyWidth() {
        return 'width:' + (this.count.lovely / this.total) * 100 + '%';
      },

    },

    methods: {
      initFirebase() {
        // Firebase初期化
        const config = {
          apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
          authDomain: "xxxxxxxxxxxxxx.firebaseapp.com",
          databaseURL: "https://xxxxxxxxxxxxxx.firebaseio.com",
          projectId: "xxxxxxxxxxxxxx",
          storageBucket: "xxxxxxxxxxxxxx.appspot.com",
          messagingSenderId: "xxxxxxxxxxxxxx"
        };
        firebase.initializeApp(config);
        this.database = firebase.database();
        this.auth = firebase.auth();
      },

      authenticate() {
        //匿名認証をする
        this.auth.signInAnonymously().catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
        });
        //uidを取得
        const _this = this;
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            _this.uid = user.uid;
          }
        });
      },

      initData() {
        const _this = this;
        _this.database.ref('data/').once('value').then(function(snapshot) {
          _this.voted = snapshot.val().voted;
          _this.count.venus = snapshot.val().count.venus;
          _this.count.honey = snapshot.val().count.honey;
          _this.count.matilda = snapshot.val().count.matilda;
          _this.count.lovely = snapshot.val().count.lovely;

          _this.getTotalCount();
        });
      },

      getTotalCount() {
        this.total = this.count.venus + this.count.honey + this.count.matilda + this.count.lovely;
      },

      getNewData() {
        this.voteData.song = this.selected;
        this.voteData.timeStamp = moment().format();
        this.count[this.voteData.song] += 1;
      },

      updateNewData() {
        this.database.ref('data/voted/' + this.uid).set(this.voteData);
        const updates = {};
        updates['data/count/'] = this.count;
        return this.database.ref().update(updates);
      },

      voteNewPost() {
        this.initData();
        //uidがデータベースに既に存在するか
        if (this.voted.hasOwnProperty(this.uid)) {
          const today = moment().format().slice(0, 10);
          const votedDay = this.voted[this.uid].timeStamp.slice(0, 10);
          //対象のuidの過去の投票日が今日であるか
          if (votedDay === today) {
            alert('投票は1日1回までです！明日お越しください。');
          } else {
            this.writeNewPost();
          }
        } else {
          this.writeNewPost();
        }
      },

      writeNewPost() {
        this.getNewData();
        this.getTotalCount();
        this.updateNewData();
        alert('投票ありがとうございます！' + this.songName[this.voteData.song] + 'に一票入りました。');
      },

    }
  });
}
