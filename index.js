//Let it be publicly known that this is the best song to ever be written ever.
//https://www.youtube.com/watch?v=NM3JqyLN7yw

//The insides of these functions will be rewritten to use MONGODB instead of the filesystem module.

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

let app = express();
var jsonParser = bodyParser.json()
var db;

app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));

//Environment variable wizardry below.
MongoClient.connect(process.env.DB_URL, (err, client) => {
  if (err) throw err;
  db = client.db(process.env.DB_NAME);
  console.log(db);
});

async function getUserById(id, callback) {
  /*var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  for (var i = 0; i < obj.length; i++) {
    if (obj[i].id == id) return obj[i];
  }*/
  var user = await db.collection('users').findOne({_id: ObjectID(id)});
  if (callback) callback(user);
}

// example usage
// getUserById(id, function (user) {
//   console.log(user);
// });

async function saveUser(user, callback) {
  //The below code copied from a website.
  console.log(user);
  var id = user._id;
  delete user._id;
  await db.collection('users').replaceOne({_id: ObjectID(id)}, user);
  if (callback) callback();
  // So this thingy does some stuff. Its pretty dank if you ask me. It mostly consists of
  // overwriting the JSON with new updated JSON, could just be an update document thing.
  /*var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  //go into the filesystem,
  for (var i = 0; i < obj.length; i++) {
    if (obj[i].id == user.id) {
      obj[i] = user;
      fs.writeFileSync('data.json', JSON.stringify(obj));
      return i;
    }
  }
  obj.push(user);
  fs.writeFileSync('data.json', JSON.stringify(obj));
  //So this bascly just overwrites the users's data, should be able to do in like one line.*/
}

app.get('/', async function (req, res) {
  //Do something here with the databse that allows pug to access a JSON object I think?
  var obj = await db.collection('users').find().toArray();
  res.render('index', {data: obj});
  console.log('Index page request fulfilled');
});
app.get('/edituser/:user', function (req, res) {
  // This function basicly makes it so that when a user is requested it takes the id
  // of the user from the response text and then sends it to the function, so that the
  // function can proceed to take that name and use it to render the HTML it is about
  // to be given.
  var user = req.params.user;
  getUserById(user, function (user) {
    res.render('editUser', {user: user});
    console.log('Edit user page request fufilled');
  });
});
app.get('/createuser', function (req, res) {
  //just renders the create user page, I just need to update the post things for this one.
  res.render('createUser');
  console.log('Create User page request fufilled');
});

app.post('/usertarget', async function(req, res) {
  //makes newBoi from the response, then pushes newBoi to the database.
  //var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  await db.collection('users').insert(req.body);
  // obj.push(req.body);
  // fs.writeFile('data.json', JSON.stringify(obj));
  // console.log('Create post');
  res.redirect('/');
});
app.post('/deleteuser', function(req, res) {
  //finds the index of the thing by its id, then it uses splice to remove that index.
  //will have to be replaced using a delete method of some kind.
  // console.log('delete user attempted');
  // console.log(req.body);
  // res.header('Content-Type', 'application/json');
  // res.send(JSON.stringify({
  //   success: true
  // }));
  // var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  // var indexOf;
  // for (var i = 0; i < obj.length; i++) {
  //   if (obj[i].id == req.body.user) {
  //     console.log('this is running and werking and doug can go to sleep');
  //     obj.splice(i,1);
  //
  //   } else{
  //     console.log('doug');
  //   }
  // }
  //
  // fs.writeFile('data.json', JSON.stringify(obj), function (err) {
  //   res.json({
  //     success: err ? false : true
  //   });
  // });
  console.log(req.body.user);
  db.collection('users').remove({_id: ObjectID(req.body.user)});
  console.log('Doug is my homie');
  res.json({
    success: true
  });
});
app.post('/updatetarget', function(req, res) {
  console.log(req.body)
  saveUser(req.body);
  console.log('J-QUERY WILL HELP YOU BUILD YOUR DOTKOM, FIND AN ELEMENT INSIDE OF THE DOM, WITH AJAX TRAVERSAL MANIPULATION, EVENT HANDLING, AND NAVIGATION, PROVIDING YOU WITH VERSITILITY, AN API WITH EXTENSIBILITY, JQUERY IS SOMETHING YOU CAN NOT IGNORE, WRITE LESS, DO MORE!');
  res.redirect('/');
});

app.get('/sorta', async function(req, res) {
  console.log(req.body);
  var obj = await db.collection('users').find({}).sort({name:1}).toArray();
  res.render('index', {data: obj});
  console.log('Alphabeticly sorted index page request fulfilled');
})
app.get('/sortra', async function(req, res) {
  console.log(req.body);
  var obj = await db.collection('users').find({}).sort({name:-1}).toArray();
  console.log(obj);
  res.render('index', {data: obj});
  console.log('Reverse alphebeticly sorted index page request fulfilled');
})
app.get('/search/:word', async function(req, res) {
  console.log(req.body);
  //pass arguments to .find, specify
  var obj = await db.collection('users').find({name:req.params.word}).toArray();
  res.render('index', {data: obj});
  console.log('Search page request fulfilled');
})

var port = 3000;

app.listen(port);

console.log('listening on port ' + port);

//Mario is pretty dank.
