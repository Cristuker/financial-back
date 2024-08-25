# Financial Management

Projeto de gerenciamento de contratos e clientes.



## Requisitos para rodar o projeto

* Node.js
* NPM
* Docker
* docker compose

## Bibliotecas

* NestJS
* Prisma
* Prisma Client
* Testcontainers
* Jest
* PG

## Como rodar

**1.** Clone este repositório

```bash
$ git clonehttps://github.com/Cristuker/financial-back.git
```

**2.** Acesse a pasta do projeto e instale as dependências na raiz

```bash
$ npm install
```

**3.** Crie um arquivo .env com as seguintes váriaveis de ambiente:

```bash
DATABASE_URL=
JWT_SECRET=
```
> Na raiz do projeto existe um arquivo .env.example para ser usado como base

**4.** Suba o banco de dados

```bash
$ docker-compose up -d # ou docker compose up -d, depende da sua versão do compose
```


**5.** Rode as migrations com o prisma

```bash
$ npx prisma migrate dev
```

**6.** Inicie o projeto

```bash
$ npm run start:dev 
```

> Esse projeto conta com documentação feito pelo Swagger na rota /api


> O projeto irá rodar na porta 3000 da sua máquina


## Testes

O projeto conta com testes e2e para rodar basta parar a execução do projeto e executar o comando abaixo.

```bash
$ npm run test:e2e  
```

O projeto também conta com alguns testes uniários que podem ser executados rodando o comando abaixo

```bash
$ npm t  
```

## Pontos relevantes

* Os testes estão lentos imagino que por conta do uso do Testcontainers, procurei abordagens diferentes de como usa-lo mas devido ao tempo e como foi a minha primeira vez com a biblioteca não consegui melhorar muito.

* O teste conta com poucos testes unitários e de integração pois dei foco em teste e2e.