var Duns   = require('../index');
var should = require('should');

describe('ObjectValidator - validates objects', function() {
  it('Validates objects', function(done) {

    var Schema = Duns.object().keys({
      age: Duns.number(),
      name: Duns.string(),
    });

    var okObj = {
      age: 10,
      name: 'niklas',
    };
    var falseObj = {
      age: 'niklas',
      name: 'niklas',
    };

    var res      = Duns.validate(okObj, Schema);
    var resfalse = Duns.validate(falseObj, Schema);
    should(res).be.true;
    should(resfalse).be.false;

    done();
  });

  it('formats empty', function(done) {
    (Duns.object({ test: 100 }).format());
    done();
  });

  it('Formats schemas with vals that does not exist', function(done) {
    var schema = Duns.object({ test: 100})
    .keys({
      test2: Duns.any().returns(function(val, siblings) {
        return siblings.test * 2;
      })
    });

    should(schema.format().test2).eql(200);
    done();
  });

  it('Returns false on no value', function(done) {
    (Duns.object().validate()).should.be.false;
    done();
  });

  it('Adds custom method', function(done) {
    should(Duns.object({}).custom(function(val) {
      return true;
    }).validate()).be.true;

    should(Duns.object({}).custom(function(val) {
      return false;
    }).validate()).be.false;

    should(Duns.object(100).custom(function(val) {
      return true;
    }).validate()).be.false;

    done();
  });

  it('Should throw on assert', function(done) {
    (Duns.object(100).assert).should.throw();
    done();
  });

  it('Can validate using shorthand syntax', function(done) {
    should(Duns.object({
      age: 100,
    }).keys({
      age: Duns.number(),
    }).validate()).be.true;
    done();
  });

  it('Validates format for objects', function(done) {

    var Schema = Duns.object().keys({
      age: Duns.number().returns(function(val) {
        return val * 2;
      }),

      name: Duns.string().returns(function(val) {
        return val + '!!';
      }),

      items: Duns.array().returns(function(val) {
        return val * 2;
      }),
    });

    var okObj = {
      age: 10,
      name: 'niklas',
      items: [
        100,
        200,
      ],
    };

    var val = Schema.init(okObj).format();

    should(val).eql(
    {
      age: 20,
      name: 'niklas!!',
      items: [
        200,
        400,
      ],
    }, 'Returns all values formatted');

    done();
  });

  it('Extends object', function(done) {
    var extensionSchema = Duns.object().extend({
      is42: function(val, param) {
        return val.test === 42;
      }
    }).keys({
      test: Duns.number()
    });

    should(extensionSchema.is42().validate({
      test: 42,
    })).be.true;

    done();
  });

  it('required() forces values to exist', function(done) {
    var Schema = Duns.object().keys({
      test: Duns.string().required(),
    });
    should(Schema.validate({ test: 'test' })).be.true;
    should(Schema.validate({ testelse: 'test' })).be.false;
    done();
  });

  it('optional() allows values to not be entered', function(done) {
    var Schema = Duns.object().keys({
      test: Duns.string(),
      opt: Duns.string().optional(),
    });

    should(Schema.validate({ test: 'test' })).be.true;
    should(Schema.validate({ test: 'test', opt: 'test', })).be.true;
    should(Schema.validate({ opt: 'test' })).be.false;
    should(Schema.validate({})).be.false;
    done();
  });

  it('forbidden() forces values to be undefined', function(done) {
    var Schema = Duns.object().keys({
      test: Duns.string(),
      opt: Duns.string().forbidden(),
    });

    should(Schema.validate({ test: 'test' })).be.true;
    should(Schema.validate({ test: 'test', opt: 'test', })).be.false;
    done();
  });

});
