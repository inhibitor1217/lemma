import mongoose from 'mongoose';
import { Future } from './future';
import { models } from './model';

export type MongoClientLogger = {
  debug: (message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
};

export type MongoClientLogLevel = 'error' | 'warn' | 'info' | 'debug';

export type MongoClientOptions = {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;

  log: {
    logger: MongoClientLogger;
    level: MongoClientLogLevel;
  };

  enableMigration: boolean;
};

const constructMongoUri = (options: MongoClientOptions): string => {
  const { host, port, database, username, password } = options;

  return `mongodb://${username}:${password}@${host}:${port}/${database}`;
};

const constructMongooseLogger = (options: MongoClientOptions): mongoose.ConnectOptions['logger'] => {
  const { logger, level } = options.log;

  return {
    className: 'MongoDB',
    debug: logger.debug.bind(logger),
    info: logger.info.bind(logger),
    warn: logger.warn.bind(logger),
    error: logger.error.bind(logger),
    isInfo: () => level === 'info',
    isWarn: () => level === 'warn',
    isError: () => level === 'error',
    isDebug: () => level === 'debug',
  };
};

export class MongoClient {
  private readonly connectionFuture: Future<void>;

  private static readonly ADMIN_DATABASE = 'admin';

  constructor(options: MongoClientOptions) {
    this.connectionFuture = new Future();

    const logger = constructMongooseLogger(options);

    mongoose
      .connect(constructMongoUri(options), {
        autoCreate: options.enableMigration,
        authSource: MongoClient.ADMIN_DATABASE,
        autoIndex: options.enableMigration,
        logger,
        loggerLevel: options.log.level,
      })
      .then(() => {
        logger?.info('Connected to MongoDB');
        this.connectionFuture.resolve();
      })
      .catch((error) => this.connectionFuture.reject(error));
  }

  get translation() {
    return models.Translation;
  }
}
