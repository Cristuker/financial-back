import { AppModule } from '@app/app.module';
import { ContractsModule } from '@app/contracts/contracts.module';
import { CreateContractDTO } from '@app/contracts/dto/create.contract.dto';
import { PrismaModule } from '@app/prisma/prisma.module';
import { CreateUserDTO } from '@app/users/dto';
import { UsersModule } from '@app/users/users.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import {
  StartedPostgreSqlContainer,
  PostgreSqlContainer,
} from '@testcontainers/postgresql';
import { execSync } from 'child_process';
import { Client } from 'pg';
import * as request from 'supertest';

describe('Contract (e2e)', () => {
  let app: INestApplication;
  let container: StartedPostgreSqlContainer;
  let prismaClient: PrismaClient;
  let urlConnection: string;
  let client: Client;

  const userStub = (): CreateUserDTO => {
    return {
      email: 'cristian@email.com',
      name: 'Cristian',
      password: 'Password@1234',
    };
  };

  const stubCreateUser = () => {
    return request(app.getHttpServer()).post('/user').send(userStub());
  };

  const stubLogin = () => {
    return request(app.getHttpServer()).post('/auth/login').send({
      email: 'cristian@email.com',
      password: 'Password@1234',
    });
  };

  const stubClient = (token) => {
    return request(app.getHttpServer())
      .post('/client')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cpfCnpj: '44057310800',
        name: 'João',
        phoneNumber: '13988089287',
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
      imports: [AppModule, UsersModule, ContractsModule, PrismaModule],
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
  });

  describe('Post', () => {
    it('should create a contract', async () => {
      await stubCreateUser();

      const token = await stubLogin();
      const client = await stubClient(token.body.access_token);
      const contractData: CreateContractDTO = {
        contractDate: new Date(),
        contractNumber: '123',
        contractValue: 10000,
        clientId: client.body.id,
      };

      await request(app.getHttpServer())
        .post('/contract')
        .set('Authorization', `Bearer ${token.body.access_token}`)
        .send(contractData)
        .then(async (response) => {
          const result = await prismaClient.contract.findUnique({
            where: {
              id: response.body.id,
            },
          });
          expect(result).toBeTruthy();
          expect(response.status).toBe(201);
          expect(result.contractNumber).toBe(contractData.contractNumber);
          expect(Number(result.contractValue)).toBe(contractData.contractValue);
          expect(new Date(result.contractDate)).toStrictEqual(
            contractData.contractDate,
          );
          expect(result.clientId).toBe(contractData.clientId);
        });
    });
  });
});
