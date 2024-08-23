import { AppModule } from '@app/app.module';
import { CreateClientDTO } from '@app/clients/dto/create.client.dto';
import { UsersModule } from '@app/users/users.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import {
  StartedPostgreSqlContainer,
  PostgreSqlContainer,
} from '@testcontainers/postgresql';
import { execSync } from 'node:child_process';
import { Client } from 'pg';
import * as request from 'supertest';

describe('Client (e2e)', () => {
  let app: INestApplication;
  let container: StartedPostgreSqlContainer;
  let prismaClient: PrismaClient;
  let urlConnection: string;
  let client: Client;

  const stubCreateUser = () => {
    return request(app.getHttpServer()).post('/user').send({
      email: 'cristian@email.com',
      name: 'Cristian',
      password: 'Password@1234',
    });
  };

  const stubLogin = () => {
    return request(app.getHttpServer()).post('/auth/login').send({
      email: 'cristian@email.com',
      password: 'Password@1234',
    });
  };

  const stubClient = (token: string) => {
    return request(app.getHttpServer())
      .post('/client')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cpfCnpj: '44057310800',
        name: 'João',
        phoneNumber: '13988089287',
      });
  };

  const stubContract = async (token: string, clientId: number) => {
    return await request(app.getHttpServer())
      .post('/contract')
      .set('Authorization', `Bearer ${token}`)
      .send({
        contractDate: new Date(),
        contractNumber: '123' + Math.random(),
        contractValue: 10000,
        clientId: clientId,
      });
  };

  beforeAll(async () => {
    container = await new PostgreSqlContainer().start();
    client = new Client({
      host: container.getHost(),
      port: container.getPort(),
      user: container.getUsername(),
      password: container.getPassword(),
      database: container.getDatabase(),
    });

    await client.connect();
    process.env.DATABASE_URL = container.getConnectionUri();
    urlConnection = container.getConnectionUri();

    prismaClient = new PrismaClient({
      datasources: {
        db: {
          url: urlConnection,
        },
      },
    });

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, UsersModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  }, 10000);

  afterAll(async () => {
    await prismaClient.$disconnect();
    await client.end();
    await container.stop();
  });

  beforeEach(async () => {
    execSync(`npx prisma migrate reset --force`, {
      env: {
        ...process.env,
        DATABASE_URL: urlConnection,
      },
    });
    execSync(`npx prisma migrate deploy`, {
      env: {
        ...process.env,
        DATABASE_URL: urlConnection,
      },
    });
  });

  describe('Post', () => {
    it('should create a client', async () => {
      const client: CreateClientDTO = {
        cpfCnpj: '44057310800',
        name: 'João',
        phoneNumber: '13988089287',
      };

      await stubCreateUser();
      const token = await stubLogin();

      await request(app.getHttpServer())
        .post('/client')
        .set('Authorization', `Bearer ${token.body.access_token}`)
        .send(client)
        .then(async (response) => {
          const result = await prismaClient.client.findUnique({
            where: {
              id: response.body.id,
            },
          });
          expect(result).toBeTruthy();
          expect(result.name).toBe(client.name);
          expect(result.cpfCnpj).toBe(client.cpfCnpj);
          expect(result.phoneNumber).toBe(client.phoneNumber);
          expect(response.status).toBe(201);
        });
    });
  });

  describe('Put', () => {
    it('should update a client', async () => {
      await stubCreateUser();
      const token = await stubLogin();
      const { body: client } = await stubClient(token.body.access_token);
      const id = client.id;
      Reflect.deleteProperty(client, 'id');
      client.name = 'João2';
      client.cpfCnpj = '47567282';
      client.phoneNumber = '13988464627';

      await request(app.getHttpServer())
        .put(`/client/${id}`)
        .set('Authorization', `Bearer ${token.body.access_token}`)
        .send(client)
        .then(async (response) => {
          const result = await prismaClient.client.findUnique({
            where: {
              id,
            },
          });
          expect(result).toBeTruthy();
          expect(result.name).toBe(client.name);
          expect(result.cpfCnpj).toBe(client.cpfCnpj);
          expect(result.phoneNumber).toBe(client.phoneNumber);
          expect(response.status).toBe(200);
        });
    });
  });

  describe('Get', () => {
    it('should list without filter', async () => {
      await stubCreateUser();

      const token = await stubLogin();
      const client = await stubClient(token.body.access_token);
      Promise.all([
        await stubContract(token.body.access_token, client.body.id),
        await stubContract(token.body.access_token, client.body.id),
        await stubContract(token.body.access_token, client.body.id),
      ]);

      await request(app.getHttpServer())
        .get('/client')
        .set('Authorization', `Bearer ${token.body.access_token}`)
        .then(async (response) => {
          expect(response.status).toBe(200);
          expect(response.body.clients.length).toBe(1);
          expect(response.body.clients[0].contracts.length).toBe(3);
        });
    });
  });
});
