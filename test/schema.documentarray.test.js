/**
 * Module dependencies.
 */

var start = require('./common'),
    mongoose = start.mongoose,
    assert = require('power-assert'),
    Schema = mongoose.Schema;

/**
 * Test.
 */

describe('schema.documentarray', function() {
  it('defaults should be preserved', function(done) {
    var child = new Schema({title: String});

    var schema1 = new Schema({x: {type: [child], default: [{title: 'Prometheus'}]}});
    var schema2 = new Schema({x: {type: [child], default: {title: 'Prometheus'}}});
    var schema3 = new Schema({
      x: {
        type: [child], default: function() {
          return [{title: 'Prometheus'}];
        }
      }
    });

    var M = mongoose.model('DefaultDocArrays1', schema1);
    var N = mongoose.model('DefaultDocArrays2', schema2);
    var O = mongoose.model('DefaultDocArrays3', schema3);

    [M, N, O].forEach(function(M) {
      var m = new M;
      assert.ok(Array.isArray(m.x));
      assert.equal(1, m.x.length);
      assert.equal('Prometheus', m.x[0].title);
    });
    done();
  });

  it('only sets if document has same schema (gh-3701)', function(done) {
    var schema1 = new Schema({
      arr: [new Schema({a: Number, b: Number}, {_id: false})]
    });
    var schema2 = new Schema({
      arr: [new Schema({a: Number}, {_id: false})]
    });

    var Model1 = mongoose.model('gh3701_0', schema1);
    var Model2 = mongoose.model('gh3701_1', schema2);

    var source = new Model1({arr: [{a: 1, b: 1}, {a: 2, b: 2}]});
    var dest = new Model2({arr: source.arr});

    assert.deepEqual(dest.toObject().arr, [{a: 1}, {a: 2}]);
    done();
  });
});
