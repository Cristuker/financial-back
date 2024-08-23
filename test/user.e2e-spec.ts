import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { PrismaClient } from '@prisma/client';
import { Client } from 'pg';
import { execSync } from 'node:child_process';
import { CreateUserDTO } from '@app/users/dto/create.user.dto';
import { UsersModule } from '@app/users/users.module';

describe('User (e2e)', () => {
  let app: INestApplication;
  let container: StartedPostgreSqlContainer;
  let prismaClient: PrismaClient;
  let urlConnection: string;
  let client: Client;

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

  describe('POST /users', () => {
    it('should create a user', async () => {
      const userData: CreateUserDTO = {
        email: 'cristian@email.com',
        name: 'Cristian',
        password: 'Password@1234',
      };

      await request(app.getHttpServer())
        .post('/user')
        .send(userData)
        .expect(201);
      const userDb = await prismaClient.user.findUnique({
        where: {
          email: userData.email,
        },
      });

      expect(userDb).toBeTruthy();
      expect(userDb.email).toBe(userData.email);
      expect(userDb.password).not.toBe(userData.password);
    });

    it('should return 400 when user already exists', async () => {
      const userData: CreateUserDTO = {
        email: 'cristian@email.com',
        name: 'Cristian',
        password: 'Password@1234',
      };
      await prismaClient.user.create({
        data: userData,
      });

      await request(app.getHttpServer())
        .post('/user')
        .send(userData)
        .expect(409);
    });
  });

  describe('PUT /users/:id', () => {
    it('should update a user', async () => {
      const userData: CreateUserDTO = {
        email: 'cristian@email.com',
        name: 'Cristian',
        password: 'Password@1234',
      };
      const createdUser = await prismaClient.user.create({
        data: userData,
      });

      createdUser.name = 'Cristian2';

      const id = createdUser.id;
      Reflect.deleteProperty(createdUser, 'id');

      await request(app.getHttpServer())
        .put(`/user/${id}`)
        .send(createdUser)
        .expect(200)
        .then((response) => {
          expect(response.body.name).toBe(createdUser.name);
        });
    });
  });
});
