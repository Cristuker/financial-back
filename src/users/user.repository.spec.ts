import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { PrismaService } from '@app/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
describe('UserRepository', () => {
  let service: UserRepository;
  let prisma: PrismaService;
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [UserRepository, PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();

    service = moduleRef.get<UserRepository>(UserRepository);

    prisma = app.get(PrismaService);

    await prisma.cleanDb();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all users', async () => {
    await prisma.user.create({
      data: {
        email: 'email@email.com',
        name: 'financial',
        password: '123',
      },
    });

    await prisma.user.create({
      data: {
        email: 'email1@email.com',
        name: 'financial',
        password: '123',
      },
    });
    const users = await service.findAll();
    expect(users.length).toBe(2);
  });

  it('should delete a user', async () => {
    await prisma.user.create({
      data: {
        email: 'email@email.com',
        name: 'financial',
        password: '123',
      },
    });

    const created = await prisma.user.create({
      data: {
        email: 'email1@email.com',
        name: 'financial',
        password: '123',
      },
    });

    await service.delete(created.id);

    const users = await service.findAll();
    expect(users.length).toBe(1);
  });

  it('should find a user by id', async () => {
    const created = await prisma.user.create({
      data: {
        email: 'email1@email.com',
        name: 'financial',
        password: '123',
      },
    });

    const user = await service.findOne(created.id);
    expect(user.email).toBe(created.email);
  });

  it('should edit a user', async () => {
    const created = await prisma.user.create({
      data: {
        email: 'email1@email.com',
        name: 'financial',
        password: '123',
      },
    });

    created.name = 'financial2';

    await service.update(created.id, created);
    const user = await service.findOne(created.id);

    expect(user.name).toBe(created.name);
  });
});
