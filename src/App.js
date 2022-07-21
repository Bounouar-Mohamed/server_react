const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const { Pool } = require("pg");
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



const isProduction = process.env.NODE_ENV === "production";
const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;
const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect();





// const pool = new Pool({

//   host: process.env.PG_HOST,
//   user: process.env.PG_USER,
//   database: process.env.PG_DATABASE,
//   password: process.env.PG_PASSWORD,
//   port: process.env.PG_PORT,
//   ssl: {
//         rejectUnauthorized: false,
//       },

// })


// pool.connect()


app.get('/', function (req, res) {

  res.send('server run on port 4000')

})


app.post("/users", function (req, res,) {


  console.log(req.body)

  let nom = req.body.firstname;
  let prenom = req.body.lastname;
  let email = req.body.email;
  let password = req.body.password;



  pool.query(
    `SELECT nom FROM users WHERE email = $1`,
    [email],
    (err, result) => {

      if (err) {
        return res.send({ err: err })
      }

      if (result.rows.length !== 0) {
        res.status(200).json({ error: "Email déjà existant !!" })
        console.log(error, ":Email déjà existant !!")
      }
      else {
        res.json({ message: "Login" })
        console.log('LOGIN')

        pool.query(` INSERT INTO "users" (firstName, lastName, email, password) VALUES ($1, $2, $3, $4 )`, [nom, prenom, email, password], (error, results) => {
          if (error) throw error;
          console.log('Inscription effectuée avec succès ');

        })
      }
    })
})


app.post("/login", function (req, res,) {


  let email = req.body.email;
  let password = req.body.password;
  let infos = []

  console.log( 'req',req)


  pool.query(
    `SELECT * FROM "users" WHERE email = $1 AND password= $2  `,
    [email, password], (error, result) => {
      if (error) throw error;

      if (result.rows.length === 0) {
        res.json({ error: "Email ou Mot de passe incorrect !!", cookies: req.session })
        console.log(error, ": Email ou Mot de passe incorrect !!")
      }

      else {

        infos.push(result.rows[0])
        res.json({ message: "Login", user: infos, cookies: req.session })
        console.log(message, ":Login", infos)
        // res.send(infos)

      }

    }).catch(err => {
      if (err.response) {
        console.log(err.response)
      }
    })
})



app.post("/sneakers", function (req, res,) {

  const URL = 'https://www.nike.com/fr/w/hommes-100-150-training-chaussures-58jtoz5ptluznik1zy7ok'

  axios(URL)
    .then(res => {

      const htmlData = res.data
      const $ = cheerio.load(htmlData)
      // res.send(res)
      console.log(res)
      //const Sneakers = []

      $('.product-card__body', htmlData).each((index, element) => {

        const name = $(element).children().find('.product-card__title').text()
        const sexe = $(element).children().find('.product-card__subtitle').text()
        const price = $(element).children().find('.product-price').text()


        pool.query(` INSERT INTO "sneakers" (name,sexe,price) VALUES ($1,$2,$3)`, [name, sexe, price], (error, results) => {
          if (error) throw error;
          console.log('Inscription effectuée avec succès ' + results);

        });

      })

    }).catch(err => console.error(err))

})




app.get('/profile', function (req, res) {


  pool.query("SELECT * FROM users WHERE users_ID=(SELECT max(users_ID) FROM users) ", (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log(results)

  });


})



app.get('/users', function (req, res) {


  pool.query("SELECT * FROM users ", (error, results) => {
    if (error) throw error;
    res.send(results);

  });
})


app.get('/sneakers', function (req, res) {


  pool.query(" SELECT * FROM sneakers", (error, results) => {
    if (error) throw error;
    res.send(results);

  });
})



app.post("/articles", function (req, res,) {

  let article = req.body.articles;

  console.log(article)


  pool.query(` INSERT INTO "articles" (article) VALUES ($1)`, [article], (error, results) => {
    if (error) throw error;
    console.log('Inscription effectuée avec succès ' + results);

  });

})