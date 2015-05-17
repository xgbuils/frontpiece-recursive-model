var Model    = require('frontpiece.model')
var isObject = require('is-object')

var ModelGet = Model.prototype.get
var ModelSet = Model.prototype.set

var RecursiveModel = Model.extend({
    get: function (key) {
        return _get(ModelGet.call(this, key))
    },
    set: function (attrs, options) {
        _set(this, attrs)
    }
})

var ModelGet = Model.prototype.get

function _set(target, source) {
    if (target instanceof Model) {
        target = target.attributes
    }
    for (var key in source) {
        var src = source[key]
        var Obj = Object
        if (src instanceof Model) {
            Obj = src.constructor
            src = src.attributes
        }
        if (isObject(src)) {
            if (!isObject(target[key])) {
                target[key] = new Obj()
            }
            _set(target[key], src)
        } else {
            target[key] = src
        }
    }
}

var _get = function (model) {
    var object = model instanceof Model ? ModelGet.call(model) : model
    if (object && typeof object === 'object') {
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