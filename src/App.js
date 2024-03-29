const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const { Pool } = require("pg");
app.use(bodyParser.json());
const axios = require('axios');
const cheerio = require('cheerio');
const { response } = require('express');




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
    `SELECT nom FROM users WHERE email = $1`,
    [email],
    (err, result) => {


  pool.query(
    `SELECT * FROM "Users_app" WHERE email = $1`,
    [email],
    (err, result) => {

      console.log('test email', result)


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


      if (result.rows.length !== 0) {

        console.log(result.rows)
        res.status(200).json({ error: "Email déjà existant !!" })
        console.log("Email déjà existant !!")
      }

      else {

        console.log('LOGIN')

        pool.query(` INSERT INTO "Users_app" (firstName, lastName, email, password) VALUES ($1, $2, $3, $4 )`, [nom, prenom, email, password], (error, result) => {
          if (error) throw error;
          console.log('Inscription effectuée avec succès ');

        }),
          pool.query(`SELECT * FROM "Users_app" WHERE email = $1`, [email], (error, results) => {
            if (error) throw error;
            res.json({ message: "Login", user: results.rows[0] });
          })

      }
    })
})


app.post("/login", function (req, res,) {



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

  // console.log( 'req',req)


  pool.query(
    `SELECT * FROM "Users_app" WHERE email = $1 AND password= $2`,
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

// app.post("/sneakers",async function (req, res,) {
// async function infos() {
//   const URL = 'https://www.nike.com/fr/w/hommes-100-150-training-chaussures-58jtoz5ptluznik1zy7ok'

//   await axios(URL)
//     .then(res => {

//       const htmlData = res.data
//       const $ = cheerio.load(htmlData)
//       const Sneakers = []

//       $('.product-card__body', htmlData).each((index, element) => {

//         const infos = { name: "", sexe: "", price: "" };

//         infos.name = $(element).children().find('.product-card__title').text()
//         infos.sexe = $(element).children().find('.product-card__subtitle').text()
//         infos.price = $(element).children().find('.product-price').text()

//         Sneakers.push(infos)

//         // connection.query(` INSERT INTO "testsneakers" (name,sexe,price) VALUES ($1,$2,$3)`, [name, sexe, price], (error, results) => {
//         //   if (error) throw error;
//         //   console.log('Inscription effectuée avec succès ' + results);

//         // });

//       })
//       console.log(Sneakers)
//     })
//   // .catch(err => console.error(err))
// }
// // })

// infos()

const API =
  'https://www.whentocop.fr/drops'
const scrapperScript = async () => {
  try {
    const { data } = await axios.get(API)
    const $ = cheerio.load(data)
    const DataBooks = $('.DropCard__ContentContainer-sc-1f2e4y6-1.hYwSTJ')
    const scrapedData = []
    DataBooks.each((index, el) => {

      const scrapItem = { title: '', color: '', ressel: '', image: '' }

      scrapItem.title = $(el).find('.DropCard__CardBrandName-sc-1f2e4y6-5.fgkISI').text()
      scrapItem.color = $(el).find('h4').text()
      scrapItem.ressel = $(el).find('p').text()
      scrapItem.image = $(el).find('img').attr('src');

      scrapedData.push(scrapItem)
    })
    console.dir(scrapedData)

  } catch (error) {
    console.error(error)
  }
}
scrapperScript()



app.post('/delete', function (req, res) {

  const id = (req.body.id)

  console.log('req id', req.body.id)


  pool.query('DELETE FROM Users_app WHERE users_id = $1', [id], (error, results) => {
    if (error) throw error;

    res.json({ message: `User deleted with ID: ${id}` })
  });
})


app.post('/update', function (req, res) {

  const id = (req.body.id)
  const firstname = (req.body.firstname)
  const lastname = (req.body.lastname)


  pool.query('UPDATE Users_app SET Firstname = $1, Lastname = $2 WHERE users_id = $3', [firstname, lastname, id], (error, results) => {
    if (error) throw error;

    res.json({ message: `User update with ID: ${id}` })
  });

})



app.get('/users', function (req, res) {



  connection.query("SELECT * FROM users ", (error, results) => {

  pool.query("SELECT * FROM Users_app ", (error, results) => {

    if (error) throw error;
    res.send(results);

  });
})
})


app.get('/sneakers', function (req, res) {



  connection.query(" SELECT * FROM sneakers", (error, results) => {

  pool.query(" SELECT * FROM sneakers", (error, results) => {

    if (error) throw error;
    res.send(results);

  });
})

})

app.post("/articles", function (req, res,) {

  let article = req.body.articles;

  console.log(article)



  connection.query(` INSERT INTO "articles" (article) VALUES ($1)`, [article], (error, results) => {

  pool.query(` INSERT INTO "articles" (article) VALUES ($1)`, [article], (error, results) => {

    if (error) throw error;
    console.log('Inscription effectuée avec succès ' + results);

  });

})

})


{/*   const URL = 'https://stockx.com/fr-fr/new-releases/sneakers'

  axios(URL)
    .then(res => {

      const htmlData = res.data
      const $ = cheerio.load(htmlData)

      // console.log(res)


      $('.css-16q1f7u', htmlData).each((index, element) => {

        const name = $(element).children().find('.chakra-text.css-1pjnepo').text()
        const date = $(element).children().find('.chakra-text.css-qoqqmm').text()
        const color = $(element).children().find('.chakra-text.css-1fo8xgy').text()
        const image = $(element).children().find('.chakra-image.css-0').find('img').attr('src')
        const priceDemande = $(element).children().find('.css-19nzkj2').text()
        const priceOffre = $(element).children().find('.css-dk7okq').text()

        console.log(name)
        pool.query(` INSERT INTO "sneakers" (name, date, color ,image, priceDemande, priceOffre) VALUES ($1,$2,$3,$4,$5)`, [name, date, color, image, priceDemande, priceOffre], (error, results) => {
          if (error) throw error;
          console.log('Inscription effectuée avec succès ' + results);

        });
      })

    }).catch(err => console.error(err))
  */}

