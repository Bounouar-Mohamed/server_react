
CREATE TABLE IF NOT EXISTS users (
    users_ID SERIAL PRIMARY KEY,
<<<<<<< HEAD
    nom VARCHAR NOT NULL,
    prenom VARCHAR NOT NULL,
=======
    firstName VARCHAR NOT NULL,
    lastName VARCHAR NOT NULL,
>>>>>>> Dockerizing
    email VARCHAR NOT NULL,
    password VARCHAR  NOT NULL
);


CREATE TABLE IF NOT EXISTS articles (

    users_ID SERIAL PRIMARY KEY,
    article VARCHAR NULL

);

CREATE TABLE IF NOT EXISTS sneakers (

    users_ID SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
<<<<<<< HEAD
    sexe VARCHAR NOT NULL,
    price VARCHAR NOT NULL

);

=======
    date VARCHAR NOT NULL,
    color VARCHAR NOT NULL,
    image VARCHAR NOT NULL,
    priceDemande VARCHAR NOT NULL,
    priceOffre VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS testsneakers (

    users_ID SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    sexe VARCHAR NOT NULL,
    price VARCHAR NOT NULL,
);
>>>>>>> Dockerizing
