CREATE TABLE member
(
    id     varchar(11) not null primary key,
    name   varchar(20) not null,
    joined date        null
);

INSERT INTO member(id, name, joined)
VALUES ('a', 'name1', '2023-01-18'),
       ('b', 'name2', '2022-07-27');