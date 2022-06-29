const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const { Pool, Client } = require("pg");
app.use(bodyParser.json());
const axios = require('axios');
const cheerio = require('cheerio');




app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



const port = process.env.PORT || 4000;
app.listen(port, () => console.log('server running...'))

const connection = new Pool({
  host: "localhost",
  user: "postgres",
  database: "postgres",
  password: 'password',
  port: 5432
});
console.log("Connexion réussie à la base de données");



app.post("/users", function (req, res,) {

  let nom = req.body.firstname;
  let prenom = req.body.lastname;
  let email = req.body.email;
  let password = req.body.password;



  connection.query(
    `SELECT nom FROM users WHERE email = $1`,
    [email],
    (err, result) => {

      if (err) {
        return res.send({ err: err })
      }

      if (result.rows.length !== 0) {
        res.status(200).json({ error: "Email déjà existant !!" })
      }
      else {
        res.json({ message: "Login" })

        connection.query(` INSERT INTO "users" (nom, prenom, email, password) VALUES ($1, $2, $3, $4 )`, [nom, prenom, email, password], (error, results) => {
          if (error) throw error;
          console.log('Inscription effectuée avec succès ');

        })
      }

    })

})


app.post("/login", function async(req, res,) {


  let email = req.body.email;
  let password = req.body.password;
  let infos = []


  connection.query(
    `SELECT * FROM users WHERE email = $1 AND password= $2  `,
    [email, password], (error, result) => {
      if (error) throw error;
      // console.log(result.rows)

      if (result.rows.length === 0) {
        res.json({ error: "Email ou Mot de passe incorrect !!", cookies: req.session })
      }

      else {

        infos.push(result.rows[0])
        res.json({ message: "Login", user: infos, cookies: req.session })
        // res.send(infos)

      }

    })
})



app.post("/sneakers", function (req, res,) {

  const URL = 'https://www.nike.com/fr/w/hommes-100-150-training-chaussures-58jtoz5ptluznik1zy7ok'

  axios(URL)
    .then(res => {

      const htmlData = res.data
      const $ = cheerio.load(htmlData)
      //const Sneakers = []

      $('.product-card__body', htmlData).each((index, element) => {

        const name = $(element).children().find('.product-card__title').text()
        const sexe = $(element).children().find('.product-card__subtitle').text()
        const price = $(element).children().find('.product-price').text()


        connection.query(` INSERT INTO "sneakers" (name,sexe,price) VALUES ($1,$2,$3)`, [name, sexe, price], (error, results) => {
          if (error) throw error;
          console.log('Inscription effectuée avec succès ' + results);

        });

      })
      //console.log(Sneakers)
    }).catch(err => console.error(err))

})




app.get('/profile', function (req, res) {


  connection.query("SELECT * FROM users WHERE users_ID=(SELECT max(users_ID) FROM users) ", (error, results) => {
    if (error) throw error;
    res.send(results);

  });


})



app.get('/users', function (req, res) {


  connection.query("SELECT * FROM users ", (error, results) => {
    if (error) throw error;
    res.send(results);

  });
})


app.get('/sneakers', function (req, res) {


  connection.query(" SELECT * FROM sneakers", (error, results) => {
    if (error) throw error;
    res.send(results);

  });
})



app.post("/articles", function (req, res,) {

  let article = req.body.articles;

  console.log(article)


  connection.query(` INSERT INTO "articles" (article) VALUES ($1)`, [article], (error, results) => {
    if (error) throw error;
    console.log('Inscription effectuée avec succès ' + results);

  });

})





