testFunction.$inject = ['$q'];

function testFunction($q) {
  $q.resolve('resolve');

  $q.reject('reject');

  $q.all([]);

  $q.when(['test']);

  $q.defer();
}
