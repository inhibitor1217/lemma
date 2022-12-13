import { Handler } from 'aws-lambda';
import { Event, Result } from './types';

/**
 * @todo
 */
const process = (event: Event): Promise<Result> => {
  console.log('event', JSON.stringify(event, null, 2));
  return Promise.resolve({});
};

export const handler: Handler<Event, Result> = (event, context, callback) => {
  process(event)
    .then((result) => callback(null, result))
    .catch((error) => callback(error));
};
