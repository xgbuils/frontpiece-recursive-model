var should = require('should')
var RecursiveModel = require('../')

describe('Frontpiece.RecursiveModel', function () {
    describe('if model has instances of Model attributes returns plain object with properties of model and deep models', function () {
        beforeEach(function () {
            var FancyModel = RecursiveModel.extend({
                initialize: function () {
                    var foo = new RecursiveModel({
                        min: 1,
                        max: 10
                    })
                    var bar = new RecursiveModel({
                        min: 2,
                        max: 8
                    })
                    this.set('foo', foo)
                    this.set('bar', bar)
                }
            })
            this.fancy = new FancyModel()
        })
        it('get()', function () {
            this.fancy.get().should.be.eql({foo: {min: 1, max: 10}, bar: {min: 2, max: 8}})
        })
        it('get("foo")', function () {
            this.fancy.get('foo').should.be.eql({min: 1, max: 10})
        })
        it('get("bar")', function () {
            this.fancy.get('bar').should.be.eql({min: 2, max: 8})
        })
        it('get("bub") returns undefined', function () {
            should(this.fancy.get('bub')).be.eql(undefined)
        })
    })
        
})
