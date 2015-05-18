var should = require('should')
var RecursiveModel = require('../')
var Model = require('frontpiece.model')

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
    describe('if model has instances of Model properties set attributes inside of model and deep models', function () {
        beforeEach(function () {
            var FancyModel = RecursiveModel.extend()
            this.fancy = new FancyModel({
                foo: new Model({
                    fizz: 'buzz'
                }),
                bar: 'tolo'
            })
            this.fancy.set({
                foo: {
                    fizz: 'zzub'
                },
                bar: 'ca'
            })
        })
        it('set object', function () {
            this.fancy.get('foo').should.be.eql({fizz: 'zzub'})
        })
        it('set object', function () {
            this.fancy.get('bar').should.be.eql('ca')
        })
        it('set object', function () {
            this.fancy.get().should.be.eql({foo: {fizz: 'zzub'}, bar: 'ca'})
        })
    })
    describe('"change" events', function () {
        beforeEach(function () {
            var self = this
            this.change = this.change_foo = this.change_bar = this.change_fizz = 0
            var FancyModel = RecursiveModel.extend({
                initialize: function () {
                    this.on('change', function () {
                        ++self.change
                    })
                    this.on('change:foo', function () {
                        ++self.change_foo
                    })
                    this.on('change:foo', function () {
                        ++self.change_bar
                    })
                    this.on('change:foo', function () {
                        ++self.change_fizz
                    })
                }
            })
            this.fancy = new FancyModel({
                foo: new FancyModel({
                    fizz: 'buzz'
                }),
                bar: 'tolo'
            })
        })
        it('triggers 2 change events', function () {
            this.change.should.be.eql(2)
        })
        it('triggers 1 change:foo event', function () {
            this.change_foo.should.be.eql(1)
        })
        it('triggers 1 change:bar event', function () {
            this.change_bar.should.be.eql(1)
        })
        it('triggers 1 change:fizz event', function () {
            this.change_fizz.should.be.eql(1)
        })
    })
})
