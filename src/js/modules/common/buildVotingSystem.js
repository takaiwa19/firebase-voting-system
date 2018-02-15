const Vue = require('vue/dist/vue.min');
const firebase = require('firebase');

export default function() {
  return new Vue({
    el: '#voting-system',

    data: {
      database: null,
      postData: {
        venus: 0,
        honey: 0,
        matilda: 0,
        lovely: 0
      },
      selected: null,
      selectedSong: null,
      total: 0,
    },

    mounted: function() {
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

      this.initNum();
    },

    computed: {

      getVenusWidth() {
        return 'width:' + (this.postData.venus / this.total) * 100 + '%';
      },

      getHoneyWidth() {
        return 'width:' + (this.postData.honey / this.total) * 100 + '%';
      },

      getMatildaWidth() {
        return 'width:' + (this.postData.matilda / this.total) * 100 + '%';
      },

      getLovelyWidth() {
        return 'width:' + (this.postData.lovely / this.total) * 100 + '%';
      },

    },

    methods: {

      initNum() {
        const _this = this;
        _this.database.ref('/songs').once('value').then(function(snapshot) {
          _this.postData.venus = snapshot.val().venus;
          _this.postData.honey = snapshot.val().honey;
          _this.postData.matilda = snapshot.val().matilda;
          _this.postData.lovely = snapshot.val().lovely;

          _this.getTotalCount();
        });
      },

      getValue() {
        this.selectedSong = this.selected;
      },

      setNum(selectedSong) {
        this.postData[selectedSong] += 1;
      },

      getTotalCount() {
        this.total = this.postData.venus + this.postData.honey + this.postData.matilda + this.postData.lovely;
      },

      writeNewPost() {
        this.getValue();
        this.setNum(this.selectedSong);
        this.getTotalCount();

        const updates = {};
        updates['/songs/'] = this.postData;
        return this.database.ref().update(updates);
      },

    }
  });
}
