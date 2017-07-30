const sinon = require('sinon');
const test = require('../index');

const startupSpies = [];
const cleanupSpies = [];

const spyBefore = provisionStartupSpy();
const spyAfter = provisionCleanupSpy();

function provisionStartupSpy() {
    const spy = sinon.stub();
    startupSpies.push(spy);
    return spy;
}

function provisionCleanupSpy() {
    const spy = sinon.stub();
    cleanupSpies.push(spy);
    return spy;
}

function resetAllStartupSpies() {
    for (var i=0; i<startupSpies.length; i++) {
        startupSpies[i].reset();
    }
}

test.before(function (handle) {
    spyBefore();
    handle.end();
});

test('Single test suite with nested tests. Before and After hooks added at suite level', function (suite) {
    suite.test('Nested test (1/2) from single test suite with nested tests. Startup and cleanup added at suite level', function (t) {
        t.equal(spyBefore.callCount, 1, 'Before hook was called once');
        t.equal(spyAfter.callCount, 0, 'After hook was not called');
        resetAllStartupSpies();
        t.end();
    });

    suite.test('Nested test (2/2) from single test suite with nested tests. Startup and cleanup added at suite level', function (t) {
        t.notOk(spyBefore.called, 'Parent Before hook should only be called before first nested child test');
        t.end();

        // Intentional asynchronous assert for cleanup hooks
        setTimeout(function () {
            t.equal(spyAfter.callCount, 1, 'After hook was called once after last child test case was executed');
        });
    });
});

test.after(function (handle) {
    spyAfter();
    handle.end();
});



