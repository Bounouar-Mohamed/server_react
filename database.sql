
CREATE TABLE IF NOT EXISTS users (
    users_ID SERIAL PRIMARY KEY,
    nom VARCHAR NULL,
    prenom VARCHAR NULL,
    email VARCHAR NULL,
    password VARCHAR  NOT NULL
);


CREATE TABLE IF NOT EXISTS articles (

    users_ID SERIAL PRIMARY KEY,
    article VARCHAR NULL

);

CREATE TABLE IF NOT EXISTS sneakers (

    users_ID SERIAL PRIMARY KEY,
    name VARCHAR NULL,
    dated VARCHAR NULL,
    price VARCHAR NULL

);

