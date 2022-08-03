const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const { Pool } = require("pg");
app.use(bodyParser.json());
const axios = require('axios');
const cheerio = require('cheerio');
const mysql = require('mysql');




app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



const port = process.env.PORT || 4000;
app.listen(port, () => console.log('server running...'))


// const isProduction = process.env.NODE_ENV === "production";
// const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.CLOUD_SQL_CONNECTION_NAME}:${process.env.PG_PORT}/${process.env.DB_NAME}`;
// const pool = new Pool({
//   connectionString: isProduction ? connectionString : connectionString,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// pool.connect();


const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS
});



app.get('/', function (req, res) {

  res.send('server run on port 4000')

})



app.post("/users", function (req, res,) {


  console.log('response server', req.body)

  let nom = req.body.firstName;
  let prenom = req.body.lastName;
  let email = req.body.email;
  let password = req.body.password;



  connection.query(
    `SELECT * FROM "users" WHERE email = $1`,
    [email],
    (err, result) => {

      console.log('test email', result)

      if (err) {
        return res.send({ err: err })
      }


      if (result.rows.length !== 0) {

        console.log(result.rows)
        res.status(200).json({ error: "Email déjà existant !!" })
        console.log(error, ":Email déjà existant !!")
      }
      else {

        res.json({ message: "Login" })
        console.log('LOGIN')

        connection.query(` INSERT INTO "users" (firstName, lastName, email, password) VALUES ($1, $2, $3, $4 )`, [nom, prenom, email, password], (error, results) => {
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

  // console.log( 'req',req)


  connection.query(
    `SELECT * FROM "users" WHERE email = $1 AND password= $2`,
    [email, password], (error, result) => {

      if (error) throw error;

      if (result.rows.length === 0) {
        //  return res.json({ error: "Email ou Mot de passe incorrect !!", cookies: req.session })
        return res.json({ error: "Email ou Mot de passe incorrect !!" })
      }

      else {
        infos.push(result.rows[0])
        // return res.json({ message: "Login", user: infos, cookies: req.session })
        return res.json({ message: "Login", user: infos })
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
      // res.send(res)
      console.log(res)
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

    }).catch(err => console.error(err))

})




app.get('/profile', function (req, res) {


  connection.query("SELECT * FROM users WHERE users_ID=(SELECT max(users_ID) FROM users) ", (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log(results)

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