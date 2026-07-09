import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('GateWay E2E (Transfers)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await app.close();
  });

  it('/transfers (POST) - should create a transfer and return 202', async () => {
    const payload = {
      fromAccount: 'conta-e2e-origem-123',
      toAccount: 'conta-e2e-destino-456',
      amount: 2500,
    };

    const response = await request(app.getHttpServer())
      .post('/transfers')
      .send(payload)
      .expect(202);

    const body = response.body as { transferId: string; status: string };

    expect(body.transferId).toBeDefined();
    expect(typeof body.transferId).toBe('string');
    expect(body.status).toBe('PROCESSING');
  });
});
