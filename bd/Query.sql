CREATE DATABASE bookStore;
USE bookStore;
CREATE TABLE books(
	bookId int auto_increment primary key,
    title varchar(50) not null,
    pages int not null, 
    price float not null,
    publishDate year not null,
    author varchar(50) not null,
    stock int not null
);

CREATE TABLE usuarios(
	id int auto_increment primary key,
    email varchar(50) not null unique,
    nombre varchar(50) not null, 
    direccion varchar(50) not null,
    password text not null
);