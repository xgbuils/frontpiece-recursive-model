var RecursiveModel = require('../')
var test  = require('./Model_test')

describe('test Model inherited behaviour', function () {
	test(RecursiveModel)
})
describe('RecursiveModel test', function () {
	require('./RecursiveModel_test')
})
