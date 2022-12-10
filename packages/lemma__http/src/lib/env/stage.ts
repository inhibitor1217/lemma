import { extend } from 'extended-enum';

enum _Stage {
  Dev = 'dev',
  Stage = 'stage',
  Prod = 'prod',
}

export default class Stage extends extend(_Stage) { }
