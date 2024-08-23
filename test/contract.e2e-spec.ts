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

  describe('Get', () => {
    it('should list without filter', async () => {
      await stubCreateUser();

      const token = await stubLogin();
      const client = await stubClient(token.body.access_token);
      await stubContract(token.body.access_token, client.body.id);
      await stubContract(token.body.access_token, client.body.id);
      await stubContract(token.body.access_token, client.body.id);

      await request(app.getHttpServer())
        .get('/contract')
        .set('Authorization', `Bearer ${token.body.access_token}`)
        .then(async (response) => {
          expect(response.status).toBe(200);
          expect(response.body.contracts.length).toBe(3);
        });
    });

    it('should list with filter', async () => {
      await stubCreateUser();

      const token = await stubLogin();
      const client = await stubClient(token.body.access_token);
      await stubContract(token.body.access_token, client.body.id);
      await stubContract(token.body.access_token, client.body.id);
      await stubContract(token.body.access_token, client.body.id);

      await request(app.getHttpServer())
        .get('/contract?page=1&limit=2')
        .set('Authorization', `Bearer ${token.body.access_token}`)
        .then(async (response) => {
          expect(response.status).toBe(200);
          expect(response.body.contracts.length).toBe(2);
          expect(response.body.contracts[0]).toHaveProperty('status');
        });
    });
  });

  describe('Patch', () => {
    it('should cancel a contract', async () => {
      await stubCreateUser();

      const token = await stubLogin();
      const client = await stubClient(token.body.access_token);
      const contract = await stubContract(
        token.body.access_token,
        client.body.id,
      );

      await request(app.getHttpServer())
        .patch(`/contract/${contract.body.id}/cancel`)
        .set('Authorization', `Bearer ${token.body.access_token}`)
        .then(async (response) => {
          expect(response.status).toBe(204);
          const result = await prismaClient.contract.findUnique({
            where: {
              id: contract.body.id,
            },
          });
          expect(result.canceled).toBe(true);
        });
    });

    it('should remove client from a contract', async () => {
      await stubCreateUser();

      const token = await stubLogin();
      const client = await stubClient(token.body.access_token);
      const contract = await stubContract(
        token.body.access_token,
        client.body.id,
      );

      await request(app.getHttpServer())
        .patch(`/contract/${contract.body.id}/remove`)
        .set('Authorization', `Bearer ${token.body.access_token}`)
        .then(async (response) => {
          expect(response.status).toBe(204);
          const result = await prismaClient.contract.findUnique({
            where: {
              id: contract.body.id,
            },
          });
          expect(result.clientId).toBeNull();
        });
    });

    it('should pay a contract', async () => {
      await stubCreateUser();
      const token = await stubLogin();
      const client = await stubClient(token.body.access_token);
      const contract = await stubContract(
        token.body.access_token,
        client.body.id,
      );

      await request(app.getHttpServer())
        .patch(`/contract/${contract.body.id}/pay`)
        .set('Authorization', `Bearer ${token.body.access_token}`)
        .then(async (response) => {
          expect(response.status).toBe(204);

          const result = await prismaClient.contract.findUnique({
            where: {
              id: contract.body.id,
            },
          });
          expect(result.payed).toBe(true);
        });
    });
  });

  describe('Put', () => {
    it('update contract', async () => {
      await stubCreateUser();

      const token = await stubLogin();
      const client = await stubClient(token.body.access_token);
      const { body: contract } = await stubContract(
        token.body.access_token,
        client.body.id,
      );
      const id = contract.id;
      Reflect.deleteProperty(contract, 'id');
      contract.contractNumber = '777';
      contract.contractDate = new Date();
      contract.contractValue = 20000;

      await request(app.getHttpServer())
        .put(`/contract/${id}`)
        .set('Authorization', `Bearer ${token.body.access_token}`)
        .send(contract)
        .then(async (response) => {
          expect(response.status).toBe(204);
          const result = await prismaClient.contract.findUnique({
            where: {
              id,
            },
          });
          expect(result.contractNumber).toBe(contract.contractNumber);
          expect(result.contractDate).toStrictEqual(contract.contractDate);
          expect(Number(result.contractValue)).toBe(contract.contractValue);
        });
    });
  });
});
