var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors')
var app = express();
var router = express.Router();
var firebase = require('firebase');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(router);

var config = {
  apiKey: "AIzaSyCdVUfB7z5pvVOngvf_dD25O7VhdohgYM4",
  authDomain: "auth-react-6f095.firebaseapp.com",
  databaseURL: "https://auth-react-6f095.firebaseio.com",
  storageBucket: "auth-react-6f095.appspot.com",
  messagingSenderId: "961579648331"
};

var fireApp = firebase.initializeApp(config);
var dbRef = fireApp.database().ref('/addresses');




(function() {
  var timeout = setInterval(function() {
    console.log('running');
    dbRef.orderByChild("timestamp").startAt(0).endAt(Date.now() - 10000).on("value", function(snapshot) {
        snapshot.forEach(function(data) {
        dbRef.child(data.key).remove();
      });
    });
    //clearInterval(timeout);
  }, 10000);
})();

router.get('/track',function(req,res){
  var clientIp =  (req.headers["X-Forwarded-For"] ||
                    req.headers["x-forwarded-for"] ||
                    '').split(',')[0] ||
                   req.client.remoteAddress;

  var clientIpArr = clientIp.split(':');
  console.log(clientIpArr);
  if( clientIpArr.length > 2){
    clientIp = clientIpArr[3];
  }else {
    clientIp = clientIpArr[0];
  }

  dbRef.push({
      value: clientIp,
      timestamp: Date.now()
  }).then(function(data){
    console.log('omg');
  }).catch(function(err){
    console.log('err',err);
    res.status(500).json({
      message: 'there is some issue with the server'
    })
  });

  res.status(200).json({
    message: 'bro'
  })
});


app.listen(3000);
