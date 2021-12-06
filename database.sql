
CREATE TABLE IF NOT EXISTS users (
    users_ID SERIAL PRIMARY KEY,
    nom VARCHAR NULL,
    prenom VARCHAR NULL,
    email VARCHAR NULL,
    passsword VARCHAR  NOT NULL
);