var test = require('../');

test.only('only6 nested only test', function (suite) {
    suite.test('nested test-1', function (t) {
        t.fail('should not be executed');
        t.end();
    });
    suite.test('nested test-2', function (t) {
        t.fail('should not be executed');
        t.end();
    });
    suite.only('nested ONLY test-3', function (t) {
        t.pass('Only nested test case that should have been run');
        t.end();
    });
});

test('only5 duplicate test name', function (t) {
    t.fail('not 2');
    t.end();
});



