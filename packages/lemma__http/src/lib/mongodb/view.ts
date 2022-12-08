import R from 'ramda';

export namespace MongoDBEntityView {
  export const from = R.pipe(R.converge(R.assoc('id'), [R.prop('_id'), R.identity]), R.omit(['_id', '__v']));
}
