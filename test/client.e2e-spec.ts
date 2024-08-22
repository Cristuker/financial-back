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
  });

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
  }, 10000);

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
});
