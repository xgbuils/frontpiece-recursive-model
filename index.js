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
        for(var key in attrs) {
            if        (attrs[key] instanceof Model) {
                ModelSet.call(this, key, attrs[key], options)
            } else if (isObject(attrs[key])) {
                var target = ModelGet.call(this, key)
                if (target instanceof Model) {
                    target.set(attrs[key], options)
                } else {
                    ModelSet.call(this, key, attrs[key], options)
                }
            } else {
                ModelSet.call(this, key, attrs[key], objectAssign({}, options, {silent: true}))
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