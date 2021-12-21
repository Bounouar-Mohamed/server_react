const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Pool,Client } = require("pg");
app.use (bodyParser.json());


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


const port = 4000;
app.listen(port, () => console.log('server running...'))

const connection = new Pool({
      host: "localhost",
      user: "postgres",
      database: "postgres",
      password : 'password',
      port : 5432
});
console.log("Connexion réussie à la base de données");
 
  

app.post("/users", function (req, res,) {


  let nom = req.body.nom ;
  let prenom = req.body.prénom ;
  let email = req.body.email ;
  let password = req.body.password ;
//  let confirmpassword = req.body.confirm_password ;


 connection.query( ` INSERT INTO "users" (nom, prenom, email, password) VALUES ($1, $2, $3, $4 )` , [nom, prenom, email, password], (error, results) => {
    if (error) throw error;
    console.log('Inscription effectuée avec succès ' + results);

  });
})


app.get('/users', function (req, res) {


  connection.query(" SELECT * FROM users ", (error, results) => {
    if (error) throw error;
    res.send(results);

  });
})