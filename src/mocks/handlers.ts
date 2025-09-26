import { rest, RestRequest, RestContext, ResponseComposition } from 'msw';

export const handlers = [
  // пример: мок авторизации
  rest.post('/api/login', async (_req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    return res(
      ctx.status(200),
      ctx.json({ token: 'mock-token', user: { id: 'u1', email: 'dev@example.com' } })
    );
  }),
  // пример: мок проектов
  rest.get('/api/projects', async (_req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    return res(
      ctx.status(200),
      ctx.json([{ id: 'p1', name: 'AI-Fitness Coach 360' }])
    );
  })
];


