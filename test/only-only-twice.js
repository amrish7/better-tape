var test = require('../');

test('Suite with two nested ONLYs', function (suite) {
  suite.plan(2);
  suite.only('First nested ONLY', function (t) {
    t.pass('First only test case was executed');
    t.end();
  });
  try {
    suite.only('Second nested ONLY', function (t) {
      t.fail('Should not have executed');
      t.end();
    });
  } catch (x) {
    suite.equal(x.message, 'there can only be one only test in a suite', 'Expected error was received');
  }
});

