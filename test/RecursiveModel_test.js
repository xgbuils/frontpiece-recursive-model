var chai = require('chai')
chai.use(require('chai-things'))
var should = chai.should()
var expect = chai.expect

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
            this.fancy.get().should.be.deep.equal({foo: {min: 1, max: 10}, bar: {min: 2, max: 8}})
        })
        it('get("foo")', function () {
            this.fancy.get('foo').should.be.deep.equal({min: 1, max: 10})
        })
        it('get("bar")', function () {
            this.fancy.get('bar').should.be.deep.equal({min: 2, max: 8})
        })
        it('get("bub") returns undefined', function () {
            expect(this.fancy.get('bub')).to.be.equal(undefined)
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
            this.fancy.get('foo').should.be.deep.equal({fizz: 'zzub'})
        })
        it('set object', function () {
            this.fancy.get('bar').should.be.equal('ca')
        })
        it('set object', function () {
            this.fancy.get().should.be.deep.equal({foo: {fizz: 'zzub'}, bar: 'ca'})
        })
    })
    describe('register "change" events', function () {
        describe('inside initialize', function () {
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
                this.change.should.be.equal(2)
            })
            it('triggers 1 change:foo event', function () {
                this.change_foo.should.be.equal(1)
            })
            it('triggers 1 change:bar event', function () {
                this.change_bar.should.be.equal(1)
            })
            it('triggers 1 change:fizz event', function () {
                this.change_fizz.should.be.equal(1)
            })
        })
        describe('before set elements. Example: {inside: {fizz: "buzz"}, bar: "tolo"}', function () {
            beforeEach(function () {
                var self = this
                this.change = this.change_foo = this.change_bar = this.change_fizz = 0
                var FancyModel = RecursiveModel.extend({
                })
                this.animal  = new FancyModel({
                    dog: 'woof'
                })
                this.inside  = new FancyModel({
                    fizz: 'buzz',
                    animal: this.animal
                })
                this.outside = new FancyModel({
                    inside: this.inside,
                    bar: 'tolo'
                })
                this.outside.on('change', function(props) {
                    ++self.change
                    self.props = props
                })
            })
            it('triggers change event when direct inner model is changed', function () {
                this.inside.set('fizz', 'zzub')
                this.change.should.be.equal(1)
            })
            it('change event callback properties are passed when direct inner model is changed', function () {
                this.inside.set('fizz', 'zzub')
                this.props.should.contain('inside.fizz').and.contain('inside')
            })
            it('triggers change event when inner model is changed', function () {
                this.animal.set('dog', 'arf')
                this.change.should.be.equal(1)
            })
            it('change event callback properties are passed when inner model is changed', function () {
                this.animal.set('dog', 'arf')
                this.props.should.contain('inside.animal').and.contain('inside.animal.dog').and.contain('inside')
            })
        })
    })
    describe('valid & invalid events', function () {
        describe('Example: {inside: {fizz: 2, animal: {dog: 0}}, bar: 4}', function () {
            beforeEach(function () {
                var self = this
                this.invalid = this.change_foo = this.change_bar = this.change_fizz = 0
                var FancyModel = RecursiveModel.extend({
                    validate: function (attrs) {
                        if (attrs.bar && attrs.bar > 5) {
                            return "error bar"
                        }
                        if (attrs.fizz && attrs.fizz > 5) {
                            return "error fizz"
                        }
                        if (attrs.dog && attrs.dog > 5) {
                            return "error dog"
                        }
                    }
                })
                this.animal  = new FancyModel({
                    dog: 0
                })
                this.inside  = new FancyModel({
                    fizz: 2,
                    animal: this.animal
                })
                this.outside = new FancyModel({
                    inside: this.inside,
                    bar: 4
                })
                this.outside.on('invalid', function(o, error, type) {
                    ++self.invalid
                    self.error = error
                    self.type  = type
                })
            })
            it('triggers "invalid" event when direct inner model is invalid', function () {
                this.inside.set('fizz', 8)
                this.invalid.should.be.equal(1)
            })
            it('"invalid" event callback error is passed when direct inner model is invalid', function () {
                this.inside.set('fizz', 8)
                this.error.should.be.equal("error fizz")
            })
            it('"invalid" event callback type is passed when direct inner model is invalid', function () {
                this.inside.set('fizz', 8)
                this.type.should.be.equal('inside')
            })
            it('triggers "invalid" event when inner model is invalid', function () {
                this.animal.set('dog', 6)
                this.invalid.should.be.equal(1)
            })
            it('"invalid" event callback error is passed when inner model is invalid', function () {
                this.animal.set('dog', 6)
                this.error.should.be.equal('error dog')
            })
            it('"invalid" event callback type is passed when inner model is invalid', function () {
                this.animal.set('dog', 6)
                this.type.should.be.equal('inside')
            })
        })
        describe('test tree structure of invalid recursive models', function () {
            before(function () {
                var self = this
                this.eventName = ''
                var FancyModel = RecursiveModel.extend({
                    validate: function (attrs) {
                        if (attrs.value > 5) {
                            return "error " + attrs.name
                        }
                    }
                })
                function instance(name) {
                    return new FancyModel({
                        name: name,
                        value: 0
                    })
                }
                this.a = instance('a')
                this.b = instance('b')
                this.c = instance('c')
                this.d = instance('d')
                this.e = new FancyModel({
                    name: 'e',
                    value: 0,
                    a: this.a,
                    b: this.b
                })
                this.f = new FancyModel({
                    name: 'f',
                    value: 0,
                    c: this.c,
                    d: this.d
                })
                this.model = new FancyModel({
                    e: this.e,
                    f: this.f,
                    value: 0
                })
                this.model.on('invalid', function (o, error, prop) {
                    self.eventName = 'invalid'
                    self.errorMessage = error
                    self.invalidProperty = prop
                    self.validationError = this.validationError
                })
                this.model.on('valid', function (o, error, prop) {
                    self.eventName = 'valid'
                    self.errorMessage = error
                    self.validationError = this.validationError
                })
            })

            describe('initial model: {value: 0, e: {value: 0, a: {value:0}, b: {value:0}}, f: {value: 0, c: {value:0}, d: {value:0}}}', function () {
                it('triggers "invalid" event when is set invalid property in "e" submodel', function () {
                    this.e.set('value', 6)
                    this.eventName.should.be.equal('invalid')
                    this.errorMessage.should.be.equal('error e')
                    this.invalidProperty.should.be.equal('e')
                    this.validationError.should.be.equal('error e')
                })
                it('triggers "invalid" event when is set invalid property in "f" submodel. Currently there are 2 invalid properties in model (e & f)', function () {
                    this.f.set('value', 9)
                    this.eventName.should.be.equal('invalid')
                    this.errorMessage.should.be.equal('error f')
                    this.invalidProperty.should.be.equal('f')
                    this.validationError.should.be.equal('error f')
                })
                it('triggers "invalid" event when is set valid property in "e" submodel. Now "e" is valid but "f" is not', function () {
                    this.e.set('value', 0)
                    this.eventName.should.be.equal('invalid')
                    this.errorMessage.should.be.equal('error f')
                    this.invalidProperty.should.be.equal('f')
                    this.validationError.should.be.equal('error f')
                })
                it('triggaers "valid" event when is set valid property in "f" submodel. Now all submodels are valids', function () {
                    this.f.set('value', 5)
                    this.eventName.should.be.equal('valid')
                    expect(this.errorMessage).to.be.equal(undefined)
                    expect(this.validationError).to.be.equal(undefined)
                })
                it('triggers "invalid" event when is set invalid property in "a" submodel', function () {
                    this.a.set('value', 6)
                    this.eventName.should.be.equal('invalid')
                    this.errorMessage.should.be.equal('error a')
                    this.invalidProperty.should.be.equal('e')
                })
                it('triggers "invalid" event when is set invalid property in "d" submodel', function () {
                    this.d.set('value', 19)
                    this.eventName.should.be.equal('invalid')
                    this.errorMessage.should.be.equal('error d')
                    this.invalidProperty.should.be.equal('f')
                    this.validationError.should.be.equal('error d')
                })
                it('triggers "invalid" event when is set invalid property in "b" submodel', function () {
                    this.b.set('value', 8)
                    this.eventName.should.be.equal('invalid')
                    this.errorMessage.should.be.equal('error b')
                    this.invalidProperty.should.be.equal('e')
                    this.validationError.should.be.equal('error b')
                })
                it('triggers "invalid" event when is set valid property in "b" submodel. Currently, "a" & "d" are invalids', function () {
                    this.b.set('value', 2)
                    this.eventName.should.be.equal('invalid')
                    ;['error a', 'error d'].should.be.contain(this.errorMessage)
                    ;['e', 'f'].should.be.contain(this.invalidProperty)
                    ;['error a', 'error d'].should.be.contain(this.validationError)
                })
                it('triggers "invalid" event when is set valid property in "a" submodel. Currently, "d" is invalid', function () {
                    this.a.set('value', 1)
                    this.eventName.should.be.equal('invalid')
                    this.errorMessage.should.be.equal('error d')
                    this.invalidProperty.should.be.equal('f')
                    this.validationError.should.be.equal('error d')
                })
                it('triggers "valid" event when is set valid property in "d" submodel. Now all submodels are valids', function () {
                    this.d.set('value', 5)
                    this.eventName.should.be.equal('valid')
                    expect(this.errorMessage).to.be.equal(undefined)
                    expect(this.validationError).to.be.equal(undefined)
                })
            })
        })
    })
})