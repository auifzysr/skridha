import { Request } from 'express';

type queryKeys = 'url' | 'channel_id' | 'width' | 'height' | 'is_full_page';

export interface RequestWithQueryParams extends Request {
  query: {
    [key in queryKeys]: string
  }
}
