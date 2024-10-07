CREATE DATABASE NotePad;
USE NotepAd;

CREATE TABLE Note (
	ID_Note int primary key auto_increment not null,
    Titulo varchar (255) not null,
    Descricao TEXT,
    Statuss ENUM ('Concluido Cabaço', 'Pendente Cabaço') not null
);

select * from Note;