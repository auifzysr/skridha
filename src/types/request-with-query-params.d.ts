import { Request } from 'express';

type queryKeys = 'url' | 'to';

export interface RequestWithQueryParams extends Request {
  query: {
    [key in queryKeys]: string
  }
}
