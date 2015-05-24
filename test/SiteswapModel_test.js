var chai = require('chai')
chai.use(require('chai-things'))
var should = chai.should()
var expect = chai.expect

var RecursiveModel = require('../')
var Model = require('frontpiece.model')

function createModels(attrs, options) {
    var self = this
    var RangeModel = RecursiveModel.extend({
        validate: function (attrs, options) {
            if (attrs.min > attrs.max) {
                return 'invalid range: ' + attrs.min + '-' + attrs.max
            }
        }
    })
    var SiteswapModel = RecursiveModel.extend({
        validate: function (attrs, options) {
            if (attrs.height.max <= attrs.balls.min && attrs.period.min > 1) {
                return 'empty patterns. Please, height.max > balls.min'
            } else if(attrs.period.min === 1 && maxHeights < minBalls) {
                return 'empty patterns. Please, height.max >= balls.min'
            }
        }
    })
    var model = this.model = {}
    model.balls  = new RangeModel({min: 1, max: 3})
    model.period = new RangeModel({min: 2, max: 3})
    model.height = new RangeModel({min: 1, max: 5})
    model.siteswap = new SiteswapModel({
        balls: model.balls,
        period: model.period,
        height: model.height
    })
    ;['balls', 'period', 'height', 'siteswap'].forEach(function (e) {
        self[e] = {}
        self[e].valid = self[e].invalid = self[e].change = 0
        model[e].on('valid', function () {
            ++self[e].valid
        })
        model[e].on('invalid', function () {
            ++self[e].invalid
        })
        model[e].on('change', function () {
            ++self[e].change
        })
    })
    model.siteswap.set(attrs, options)
}

describe('When is set valid siteswap model', function () {
    beforeEach(function () {
        createModels.call(this, {
            balls:  {min: 1, max: 3},
            period: {min: 2, max: 3},
            height: {min: 1, max: 5}
        })
    })
    // siteswap
    it('triggers valid event on siteswap when is set valid siteswap', function () {
        this.siteswap.valid.should.be.equal(1)
    })
    it('does not trigger invalid event on siteswap when is set valid siteswap', function () {
        this.siteswap.invalid.should.be.equal(0)
    })
    it('validationError property in siteswap is undefined when is set valid siteswap', function () {
        expect(this.model.siteswap.validationError).to.be.equal(undefined)
    })
    it('triggers change event on siteswap when is set properties in siteswap', function () {
        this.siteswap.change.should.be.equal(1)
    })
    // balls
    it('triggers valid event on balls model when is set valid balls submodel in siteswap', function () {
        this.balls.valid.should.be.equal(1)
    })
    it('does not trigger invalid event on balls model when is set valid balls submodel in siteswap', function () {
        this.balls.invalid.should.be.equal(0)
    })
    it('validationError property in balls model is undefined when is set valid balls submodel in siteswap', function () {
        expect(this.model.balls.validationError).to.be.equal(undefined)
    })
    it('triggers change event on siteswap when is changed balls submodel in siteswap', function () {
        this.balls.change.should.be.equal(1)
    })
    // period
    it('triggers valid event on period model when is set valid period submodel in siteswap', function () {
        this.period.valid.should.be.equal(1)
    })
    it('does not trigger invalid event on period model when is set valid period submodel in siteswap', function () {
        this.period.invalid.should.be.equal(0)
    })
    it('validationError property in period model is undefined when is set valid period submodel in siteswap', function () {
        expect(this.model.period.validationError).to.be.equal(undefined)
    })
    it('triggers change event on siteswap when is changed period submodel in siteswap', function () {
        this.period.change.should.be.equal(1)
    })
    // height
    it('triggers valid event on height model when is set valid height submodel in siteswap', function () {
        this.height.valid.should.be.equal(1)
    })
    it('does not trigger invalid event on height model when is set valid height submodel in siteswap', function () {
        this.height.invalid.should.be.equal(0)
    })
    it('validationError property in height model is undefined when is set valid height submodel in siteswap', function () {
        expect(this.model.height.validationError).to.be.equal(undefined)
    })
    it('triggers change event on siteswap when is changed height submodel in siteswap', function () {
        this.height.change.should.be.equal(1)
    })
})

describe('When is set siteswap model with invalid balls submodel', function () {
    beforeEach(function () {
        createModels.call(this, {
            balls:  {min: 7, max: 3},
            period: {min: 2, max: 3},
            height: {min: 1, max: 5}
        })
    })
    // siteswap
    it('does not trigger valid event on siteswap when is set invalid siteswap', function () {
        this.siteswap.valid.should.be.equal(0)
    })
    it('triggers invalid event on siteswap when is set invalid siteswap', function () {
        this.siteswap.invalid.should.be.equal(1)
    })
    it('triggers change event on siteswap when is set properties in siteswap', function () {
        this.siteswap.change.should.be.equal(1)
    })
    it('validationError property in siteswap is truly string when is set invalid siteswap', function () {
        expect(this.model.siteswap.validationError).to.be.equal('invalid range: 7-3')
    })
    // balls
    it('does not trigger valid event on balls model when is set invalid balls submodel in siteswap', function () {
        this.balls.valid.should.be.equal(0)
    })
    it('triggers invalid event on balls model when is set invalid balls submodel in siteswap', function () {
        this.balls.invalid.should.be.equal(1)
    })
    it('validationError property in balls model is truly string when is set invalid balls submodel in siteswap', function () {
        expect(this.model.balls.validationError).to.be.equal('invalid range: 7-3')
    })
    it('triggers change event on siteswap when is changed balls submodel in siteswap', function () {
        this.balls.change.should.be.equal(1)
    })
    // period
    it('triggers valid event on period model when is set valid period submodel in siteswap', function () {
        this.period.valid.should.be.equal(1)
    })
    it('does not trigger invalid event on period model when is set valid period submodel in siteswap', function () {
        this.period.invalid.should.be.equal(0)
    })
    it('validationError property in period model is undefined when is set valid period submodel in siteswap', function () {
        expect(this.model.period.validationError).to.be.equal(undefined)
    })
    it('triggers change event on siteswap when is changed period submodel in siteswap', function () {
        this.period.change.should.be.equal(1)
    })
    // height
    it('triggers valid event on height model when is set valid height submodel in siteswap', function () {
        this.height.valid.should.be.equal(1)
    })
    it('does not trigger invalid event on height model when is set valid height submodel in siteswap', function () {
        this.height.invalid.should.be.equal(0)
    })
    it('validationError property in height model is undefined when is set valid height submodel in siteswap', function () {
        expect(this.model.height.validationError).to.be.equal(undefined)
    })
    it('triggers change event on siteswap when is changed height submodel in siteswap', function () {
        this.height.change.should.be.equal(1)
    })
})

describe('When is set siteswap model with invalid period and height submodel', function () {
    beforeEach(function () {
        createModels.call(this, {
            balls:  {min: 2, max: 3},
            period: {min: 4, max: 3},
            height: {min: 8, max: 5}
        })
    })
    // siteswap
    it('does not trigger valid event on siteswap when is set invalid siteswap', function () {
        this.siteswap.valid.should.be.equal(0)
    })
    it('triggers invalid event on siteswap when is set invalid siteswap', function () {
        this.siteswap.invalid.should.be.equal(1)
    })
    it('triggers change event on siteswap when is set properties in siteswap', function () {
        this.siteswap.change.should.be.equal(1)
    })
    it('validationError property in siteswap is truly string when is set invalid siteswap', function () {
        ['invalid range: 4-3', 'invalid range: 8-5'].should.contain(this.model.siteswap.validationError)
    })
    // balls
    it('triggers valid event on balls model when is set valid balls submodel in siteswap', function () {
        this.balls.valid.should.be.equal(1)
    })
    it('does not trigger invalid event on balls model when is set valid balls submodel in siteswap', function () {
        this.balls.invalid.should.be.equal(0)
    })
    it('validationError property in balls model is undefined when is set valid balls submodel in siteswap', function () {
        expect(this.model.balls.validationError).to.be.equal(undefined)
    })
    it('triggers change event on siteswap when is changed balls submodel in siteswap', function () {
        this.balls.change.should.be.equal(1)
    })
    // period
    it('does not trigger valid event on period model when is set invalid period submodel in siteswap', function () {
        this.period.valid.should.be.equal(0)
    })
    it('triggers invalid event on period model when is set invalid period submodel in siteswap', function () {
        this.period.invalid.should.be.equal(1)
    })
    it('validationError property in period model is truly string when is set invalid period submodel in siteswap', function () {
        expect(this.model.period.validationError).to.be.equal('invalid range: 4-3')
    })
    it('triggers change event on siteswap when is changed period submodel in siteswap', function () {
        this.period.change.should.be.equal(1)
    })
    // height
    it('does not trigger valid event on height model when is set invalid height submodel in siteswap', function () {
        this.height.valid.should.be.equal(0)
    })
    it('triggers invalid event on height model when is set invalid height submodel in siteswap', function () {
        this.height.invalid.should.be.equal(1)
    })
    it('validationError property in height model is truly string when is set invalid height submodel in siteswap', function () {
        expect(this.model.height.validationError).to.be.equal('invalid range: 8-5')
    })
    it('triggers change event on siteswap when is changed height submodel in siteswap', function () {
        this.height.change.should.be.equal(1)
    })
})

describe('When is set valid submodels in siteswap model but siteswap is invalid', function () {
    beforeEach(function () {
        createModels.call(this, {
            balls:  {min: 4, max: 4},
            period: {min: 2, max: 3},
            height: {min: 1, max: 4}
        })
    })
    // siteswap
    it('does not trigger valid event on siteswap when is set invalid siteswap', function () {
        this.siteswap.valid.should.be.equal(0)
    })
    it('triggers invalid event on siteswap when is set invalid siteswap', function () {
        this.siteswap.invalid.should.be.equal(1)
    })
    it('validationError property in siteswap is undefined when is set valid siteswap', function () {
        expect(this.model.siteswap.validationError).to.be.equal('empty patterns. Please, height.max > balls.min')
    })
    it('triggers change event on siteswap when is set properties in siteswap', function () {
        this.siteswap.change.should.be.equal(1)
    })
    // balls
    it('triggers valid event on balls model when is set valid balls submodel in siteswap', function () {
        this.balls.valid.should.be.equal(1)
    })
    it('does not trigger invalid event on balls model when is set valid balls submodel in siteswap', function () {
        this.balls.invalid.should.be.equal(0)
    })
    it('validationError property in balls model is undefined when is set valid balls submodel in siteswap', function () {
        expect(this.model.balls.validationError).to.be.equal(undefined)
    })
    it('triggers change event on siteswap when is changed balls submodel in siteswap', function () {
        this.balls.change.should.be.equal(1)
    })
    // period
    it('triggers valid event on period model when is set valid period submodel in siteswap', function () {
        this.period.valid.should.be.equal(1)
    })
    it('does not trigger invalid event on period model when is set valid period submodel in siteswap', function () {
        this.period.invalid.should.be.equal(0)
    })
    it('validationError property in period model is undefined when is set valid period submodel in siteswap', function () {
        expect(this.model.period.validationError).to.be.equal(undefined)
    })
    it('triggers change event on siteswap when is changed period submodel in siteswap', function () {
        this.period.change.should.be.equal(1)
    })
    // height
    it('triggers valid event on height model when is set valid height submodel in siteswap', function () {
        this.height.valid.should.be.equal(1)
    })
    it('does not trigger invalid event on height model when is set valid height submodel in siteswap', function () {
        this.height.invalid.should.be.equal(0)
    })
    it('validationError property in height model is undefined when is set valid height submodel in siteswap', function () {
        expect(this.model.height.validationError).to.be.equal(undefined)
    })
    it('triggers change event on siteswap when is changed height submodel in siteswap', function () {
        this.height.change.should.be.equal(1)
    })
})

describe('When is set valid siteswap model and after set valid submodel', function () {
    beforeEach(function () {
        createModels.call(this, {
            balls:  {min: 1, max: 3},
            period: {min: 2, max: 3},
            height: {min: 1, max: 5}
        }, {silent: true})
    })
    // siteswap
    it('triggers valid event on siteswap when is set valid balls model', function () {
        this.model.balls.set('min', 2)
        this.siteswap.valid.should.be.equal(1)
    })
    it('does not trigger invalid event on siteswap when is set valid balls model', function () {
        this.model.balls.set('max', 2)
        this.siteswap.invalid.should.be.equal(0)
    })
    it('validationError property in siteswap is undefined when is set valid siteswap', function () {
        this.model.balls.set('max', 2)
        expect(this.model.siteswap.validationError).to.be.equal(undefined)
    })
    it('triggers change event on siteswap when is set properties in balls model', function () {
        this.model.balls.set('max', 2)
        this.siteswap.change.should.be.equal(1)
    })
    // balls
    it('triggers valid event on balls model when is set valid balls submodel', function () {
        this.model.balls.set('max', 2)
        this.balls.valid.should.be.equal(1)
    })
    it('does not trigger invalid event on balls model when is set valid balls submodel', function () {
        this.model.balls.set('max', 2)
        this.balls.invalid.should.be.equal(0)
    })
    it('validationError property in balls model is undefined when is set valid balls submodel', function () {
        this.model.balls.set('max', 2)
        expect(this.model.balls.validationError).to.be.equal(undefined)
    })
    it('triggers change event on siteswap when is changed balls submodel', function () {
        this.model.balls.set('max', 2)
        this.balls.change.should.be.equal(1)
    })
    // period
    it('does not trigger valid event on period model when is set valid balls submodel', function () {
        this.model.balls.set('max', 2)
        this.period.valid.should.be.equal(0)
    })
    it('does not trigger invalid event on period model when is set valid balls submodel', function () {
        this.model.balls.set('max', 2)
        this.period.invalid.should.be.equal(0)
    })
    it('validationError property in period model is undefined when is set valid balls submodel', function () {
        this.model.balls.set('max', 2)
        expect(this.model.period.validationError).to.be.equal(undefined)
    })
    it('does not trigger change event on siteswap when is not changed period submodel', function () {
        this.model.balls.set('max', 2)
        this.period.change.should.be.equal(0)
    })
})

describe('When is set valid siteswap model and after set invalid submodel', function () {
    beforeEach(function () {
        createModels.call(this, {
            balls:  {min: 1, max: 3},
            period: {min: 2, max: 3},
            height: {min: 1, max: 5}
        }, {silent: true})
    })
    // siteswap
    it('does not trigger valid event on siteswap when is set invalid period model', function () {
        this.model.period.set('max', 1)
        this.siteswap.valid.should.be.equal(0)
    })
    it('triggers invalid event on siteswap when is set invalid period model', function () {
        this.model.period.set('max', 1)
        this.siteswap.invalid.should.be.equal(1)
    })
    it('validationError property in siteswap is truly string when is set invalid period model', function () {
        this.model.period.set('max', 1)
        expect(this.model.siteswap.validationError).to.be.equal('invalid range: 2-1')
    })
    it('triggers change event on siteswap when is set properties in period model', function () {
        this.model.period.set('max', 1)
        this.siteswap.change.should.be.equal(1)
    })
    // period
    it('does not trigger valid event on period model when is set invalid period submodel', function () {
        this.model.period.set('max', 1)
        this.period.valid.should.be.equal(0)
    })
    it('triggers invalid event on period model when is set invalid period submodel', function () {
        this.model.period.set('max', 1)
        this.period.invalid.should.be.equal(1)
    })
    it('validationError property in period model is truly string when is set invalid period submodel', function () {
        this.model.period.set('max', 1)
        expect(this.model.period.validationError).to.be.equal('invalid range: 2-1')
    })
    it('triggers change event on period submodel when is changed period submodel', function () {
        this.model.period.set('max', 1)
        this.period.change.should.be.equal(1)
    })
    // height
    it('does not trigger valid event on height model when is set invalid period model', function () {
        this.model.period.set('max', 1)
        this.height.valid.should.be.equal(0)
    })
    it('does not trigger invalid event on height model when is set invalid period model', function () {
        this.model.period.set('max', 1)
        this.height.invalid.should.be.equal(0)
    })
    it('validationError property in height model is undefined when is set invalid period model', function () {
        this.model.period.set('max', 1)
        expect(this.model.height.validationError).to.be.equal(undefined)
    })
    it('does not trigger change event on height model when is changed period model', function () {
        this.model.period.set('max', 1)
        this.height.change.should.be.equal(0)
    })
})

describe('When is set invalid siteswap model and after set valid properties in submodel that becomes valid siteswap', function () {
    beforeEach(function () {
        createModels.call(this, {
            balls:  {min: 1, max: 3},
            period: {min: 2, max: 3},
            height: {min: 7, max: 5}
        }, {silent: true})
    })
    // siteswap
    it('triggers valid event on siteswap when height and siteswaps models become to valid models', function () {
        this.model.height.set('min', 3)
        this.siteswap.valid.should.be.equal(1)
    })
    it('does not trigger invalid event on siteswap when height and siteswaps models become to valid models', function () {
        this.model.height.set('min', 3)
        this.siteswap.invalid.should.be.equal(0)
    })
    it('validationError property in siteswap is undefined when height and siteswaps models become to valid models', function () {
        this.model.height.set('min', 3)
        expect(this.model.siteswap.validationError).to.be.equal(undefined)
    })
    it('triggers change event on siteswap when is set properties in height model', function () {
        this.model.height.set('min', 3)
        this.siteswap.change.should.be.equal(1)
    })
    // period
    it('does not trigger valid event on period model when height and siteswaps models become to valid models', function () {
        this.model.height.set('min', 3)
        this.period.valid.should.be.equal(0)
    })
    it('does not trigger invalid event on period model when height and siteswaps models become to valid models', function () {
        this.model.height.set('min', 3)
        this.period.invalid.should.be.equal(0)
    })
    it('validationError property in period model is undefined when height and siteswaps models become to valid models', function () {
        this.model.height.set('min', 3)
        expect(this.model.period.validationError).to.be.equal(undefined)
    })
    it('does not triggers change event on period submodel when is set properties in height model', function () {
        this.model.height.set('min', 3)
        this.period.change.should.be.equal(0)
    })
    // height
    it('triggers valid event on height model when is set valid height model', function () {
        this.model.height.set('min', 3)
        this.height.valid.should.be.equal(1)
    })
    it('does not trigger invalid event on height model when is set valid height model', function () {
        this.model.height.set('min', 3)
        this.height.invalid.should.be.equal(0)
    })
    it('validationError property in height model is undefined when is set valid height model', function () {
        this.model.height.set('min', 3)
        expect(this.model.height.validationError).to.be.equal(undefined)
    })
    it('triggers change event on height model when is changed height model', function () {
        this.model.height.set('min', 3)
        this.height.change.should.be.equal(1)
    })
})

describe('When is set invalid siteswap model and after set valid properties in submodel that does not become valid siteswap', function () {
    beforeEach(function () {
        createModels.call(this, {
            balls:  {min: 4, max: 5},
            period: {min: 2, max: 3},
            height: {min: 7, max: 3}
        }, {silent: true})
    })
    // siteswap
    it('does not trigger valid event on siteswap when is set valid height but siteswap does not become valid model', function () {
        this.model.height.set('min', 1)
        this.siteswap.valid.should.be.equal(0)
    })
    it('triggers invalid event on siteswap when is set valid height but siteswap does not become valid model', function () {
        this.model.height.set('min', 1)
        this.siteswap.invalid.should.be.equal(1)
    })
    it('validationError property in siteswap is truly string when is set valid height but siteswap does not become valid model', function () {
        this.model.height.set('min', 1)
        expect(this.model.siteswap.validationError).to.be.equal('empty patterns. Please, height.max > balls.min')
    })
    it('triggers change event on siteswap when is set properties in height model', function () {
        this.model.height.set('min', 1)
        this.siteswap.change.should.be.equal(1)
    })
    // period
    it('does not trigger valid event on period model when height and siteswaps models become to valid models', function () {
        this.model.height.set('min', 1)
        this.period.valid.should.be.equal(0)
    })
    it('does not trigger invalid event on period model when height and siteswaps models become to valid models', function () {
        this.model.height.set('min', 1)
        this.period.invalid.should.be.equal(0)
    })
    it('validationError property in period model is undefined when height and siteswaps models become to valid models', function () {
        this.model.height.set('min', 1)
        expect(this.model.period.validationError).to.be.equal(undefined)
    })
    it('does not triggers change event on period submodel when is set properties in height model', function () {
        this.model.height.set('min', 1)
        this.period.change.should.be.equal(0)
    })
    // height
    it('triggers valid event on height model when is set valid height model', function () {
        this.model.height.set('min', 1)
        this.height.valid.should.be.equal(1)
    })
    it('does not trigger invalid event on height model when is set valid height model', function () {
        this.model.height.set('min', 1)
        this.height.invalid.should.be.equal(0)
    })
    it('validationError property in height model is undefined when is set valid height model', function () {
        this.model.height.set('min', 1)
        expect(this.model.height.validationError).to.be.equal(undefined)
    })
    it('triggers change event on height model when is changed height model', function () {
        this.model.height.set('min', 1)
        this.height.change.should.be.equal(1)
    })
})