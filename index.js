var Model = require('frontpiece.model')

var ModelGet = Model.prototype.get

var RecursiveModel = Model.extend({
    get: function (key) {
        return _get(ModelGet.call(this, key))
    },
})

var ModelGet = Model.prototype.get

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