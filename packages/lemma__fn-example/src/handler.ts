import { Handler } from 'aws-lambda';
import { Event, Result } from './types';

export const handler: Handler<Event, Result> = (event, context) => {
  return Promise.resolve({});
};
