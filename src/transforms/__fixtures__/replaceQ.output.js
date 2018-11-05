import { deferPromise } from 'defer-promise';
testFunction.$inject = [];

function testFunction() {
  Promise.resolve('resolve');

  Promise.reject('reject');

  Promise.all([]);

  resolve.Promise();

  deferPromise();
}