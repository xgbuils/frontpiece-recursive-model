var Model        = require('frontpiece.model')
var objectAssign = require('object-assign')
var isObject     = require('is-object')

var ModelProto = Model.prototype
var ModelGet = ModelProto.get
var ModelSet = ModelProto.set

var RecursiveModel = Model.extend({
    get: function (key) {
        return _get(ModelGet.call(this, key))
    },
    set: function (attrs, options) {
        var model = this
        model._errors || (model._errors = {})
        if (!options.__break) {
            optionsBreak = objectAssign({}, options, {__break: true})
        } else {
            optionsBreak = options
        }
        Object.keys(attrs).forEach(function (key) {
            if        (attrs[key] instanceof Model) {
                attrs[key].on('invalid', function (o, error, type) {
                    model.validationError = model._errors[key] = error
                })
                attrs[key].on('valid', function (o, error, type) {
                    delete model._errors[key]
                    var keys = Object.keys(model._errors)
                    if (keys.length > 0) {
                        model.validationError = model._errors[keys[0]]
                    }
                })
                attrs[key]._parent = model
                ModelSet.call(model, key, attrs[key], optionsBreak)
            } else if (isObject(attrs[key])) {
                var target = ModelGet.call(model, key)
                if (target instanceof Model) {
                    target.set(attrs[key], optionsBreak)
                } else {
                    ModelSet.call(model, key, attrs[key], optionsBreak)
                }
            } else {
                ModelSet.call(model, key, attrs[key], objectAssign({}, optionsBreak, {silent: true}))
            }
        })
    },
    _validate: function (attrs, options) {
        var keys = Object.keys(this._errors || {})
        var error
        if (keys.length > 0) {
            error = this.validationError
            this.trigger('invalid', this, error)
        } else {
            error = ModelProto._validate.call(this, this.get(), options)
        }

        if (!options.__break) {
            var parent = this._parent
            if (parent) {
                parent._validate(parent.get(), options)
            }
        }
        return error
    },
    _change: function (attrs, options) {
        ModelProto._change.call(this, attrs, options)
        if (!options.__break) {
            var parent = this
            while (parent = parent._parent) {
                parent.trigger('change')
            }
        }
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