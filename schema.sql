DROP TABLE IF EXISTS movie;

CREATE TABLE IF NOT EXISTS movie (
    id varchar(255),
    title varchar(255),
    release_date varchar(255),
    poster_path varchar(255),
    overview varchar(65535),
    personal_comments varchar(65535)
);