CREATE TYPE status_consulta AS ENUM 
('Concluída', 'Agendada', 'Cancelada');

CREATE TABLE if not exists Cliente (
    id_cliente SERIAL PRIMARY KEY,
	cpf VARCHAR(14) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha  VARCHAR(128) NOT NULL
);

CREATE TABLE if not exists Dentista (
    id_dentista SERIAL PRIMARY KEY,
	cpf VARCHAR(14) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha  VARCHAR(128) NOT NULL
);


CREATE TABLE if not exists Agendamento(
	id_agendamento SERIAL PRIMARY KEY,
	id_cliente INTEGER NOT NULL,
	id_dentista INTEGER NOT NULL,
    titulo VARCHAR (255) NOT NULL,
	descricao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	data_consulta TIMESTAMP NOT NULL,
	status status_consulta NOT NULL DEFAULT 'Agendada',
	FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente) ON DELETE CASCADE,
    FOREIGN KEY (id_dentista) REFERENCES Dentista(id_dentista) ON DELETE CASCADE 
);