import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { AuthModule } from '@app/auth/auth.module';
import { execSync } from 'node:child_process';
import { AppModule } from '@app/app.module';
import { PrismaClient } from '@prisma/client';
import {
  StartedPostgreSqlContainer,
  PostgreSqlContainer,
} from '@testcontainers/postgresql';
import { Client } from 'pg';
import { CreateUserDTO } from '@app/users/dto/create.user.dto';

describe('Auth e2e', () => {
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
      imports: [AppModule, UsersModule, AuthModule],
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

  afterAll(async () => {
    await app.close();
  });

  it('should generate a token', async () => {
    const userData: CreateUserDTO = {
      email: 'cristian@email.com',
      name: 'Cristian',
      password: 'Password@1234',
    };

    await request(app.getHttpServer()).post('/user').send(userData).expect(201);

    const user = {
      email: 'cristian@email.com',
      password: 'Password@1234',
    };

    return request(app.getHttpServer())
      .post('/auth/login')
      .send(user)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('access_token');
        expect(response.body.access_token.length).toBeGreaterThan(0);
      });
  });
});
