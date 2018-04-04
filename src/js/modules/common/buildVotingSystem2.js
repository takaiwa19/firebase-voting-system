const Vue = require('vue/dist/vue.min');
const firebase = require('firebase');
const moment = require('moment');

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
const database = firebase.database();
const auth = firebase.auth();


//Vue
export default function() {
  return new Vue({
    el: '#voting-system-2',

    data: {
      database: database,
      auth: auth,
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
        song: -1,
        timeStamp: 0
      },
      selected: null,
      total: 0,
    },

    created: function() {

      const _this = this;
      this.database.ref('data').on('value',snapshot => {
          _this.count = snapshot.val().count;
          _this.voted = snapshot.val().voted;

          _this.getTotalCount();
          _this.authenticate();
        }
      )

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
        this.auth.onAuthStateChanged(function(user) {
          if (user) {
            _this.uid = user.uid;
            if(!_this.voted.hasOwnProperty(_this.uid)) {
              _this.database.ref('data/voted/' + _this.uid).set(_this.voteData);
            }
          }
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

      updateCount() {
        //各曲の投票数を更新
        const updates = {};
        updates['data/count/'] = this.count;
        this.database.ref().update(updates);
      },

      updateVoted() {
        //投票者の情報を登録
        this.database.ref('data/voted/' + this.uid).set(this.voteData);
      },

      voteNewPost() {
        //対象のuidが過去に投票をしたことがあるか
        if (!(this.voted[this.uid].timeStamp === 0)) {
          const today = moment().format().slice(0, 10);
          const votedDay = this.voted[this.uid].timeStamp.slice(0, 10);
          //過去の投票日が「今日」であるか
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
        this.updateCount();
        setTimeout(()=> {
          this.updateVoted();
          alert('投票ありがとうございます！' + this.songName[this.voteData.song] + 'に一票入りました。');
        },100)
      },
    }
  });
}
