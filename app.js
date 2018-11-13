const express = require('express');
const app = express();
const mongoose = require('mongoose');

//Settings
app.set('view engine','pug');
app.set('views','views');
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { useNewUrlParser: true });//Conexion a mongodb y creacion de la base de datos mongo-1

//Middlewares
app.use(express.urlencoded()); //Para leer el cuerpo de las peticiones hechas por los formularios.
app.use(express.static(__dirname + '/public')); //Para acceder a lo que se encuentra en la carpeta public.

//Database
const { Schema } = mongoose;
const UserSchema = new Schema ({
  name: String,
  email: String,
  password: String
})
const User = mongoose.model('User', UserSchema);

//Routes
app.get('/', async (req,res) => {
  const allUsers = await User.find({});
  res.render('index', {users: allUsers});
});

app.get('/register', (req,res) => {
  res.render('form');
});

app.post('/register',async (req,res) => {
  const user =  new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  await user.save();
  const allUsers = await User.find({});
  res.render('index', {users: allUsers})
});

//Port
app.listen(3000, () => {
  console.log('Listening on port 3000!');
});