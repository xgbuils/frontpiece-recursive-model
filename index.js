var Model        = require('frontpiece.model')
var objectAssign = require('object-assign')
var isObject     = require('is-object')

var ModelGet = Model.prototype.get
var ModelSet = Model.prototype.set

var RecursiveModel = Model.extend({
    get: function (key) {
        return _get(ModelGet.call(this, key))
    },
    set: function (attrs, options) {
        var model = this
        model._errors || (model._errors = {})
        Object.keys(attrs).forEach(function (key) {
            if        (attrs[key] instanceof Model) {
                attrs[key].on('change', function (props) {
                    var changes = []
                    props.forEach(function (prop) {
                        changes.push(key + '.' + prop)
                        model.trigger('change:' + key + '.' + prop)
                    })
                    changes.push(key)
                    model.trigger('change:' + key)
                    model.trigger('change', changes)
                })
                attrs[key].on('invalid', function (o, error, type) {
                    model.validationError = model._errors[key] = error
                    model.trigger('invalid:' + key, model, error)
                    model.trigger('invalid', model, error, key)
                })
                attrs[key].on('valid', function (o, error, type) {
                    delete model._errors[key]
                    model.trigger('invalid:' + key)
                    var keys = Object.keys(model._errors)
                    if (keys.length > 0) {
                        model.validationError = model._errors[keys[0]]
                        model.trigger('invalid', model, model._errors[keys[0]], keys[0])
                    } else {
                        model.validationError = undefined
                        model.trigger('valid', model, undefined, key)
                    }
                })
                ModelSet.call(model, key, attrs[key], options)
            } else if (isObject(attrs[key])) {
                var target = ModelGet.call(model, key)
                if (target instanceof Model) {
                    target.set(attrs[key], options)
                } else {
                    ModelSet.call(model, key, attrs[key], options)
                }
            } else {
                ModelSet.call(model, key, attrs[key], objectAssign({}, options, {silent: true}))
            }
        })
    }
})

var _get = function (model) {
    var object = model instanceof Model ? ModelGet.call(model) : model
    if (isObject(object)) {
        var attrs = {}
        for (var key in object) {
            attrs[key] = _get(object[key])
        }
        return attrs
    } else {
        return object
    }
}

module.exports = RecursiveModel