const sinon = require('sinon');
const test = require('../index');

const startupSpies = [];
const cleanupSpies = [];

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

function resetAllCleanupSpies() {
    for (var i=0; i<cleanupSpies.length; i++) {
        cleanupSpies[i].reset();
    }
}

const spyParentBefore = provisionStartupSpy();
const spyParentAfter = provisionCleanupSpy();

const spyChildBefore = provisionStartupSpy();
const spyChildAfter = provisionCleanupSpy();

test.before(function (handle) {
    spyParentBefore();
    handle.end();
});

test.after(function (handle) {
    spyParentAfter();
    handle.end();
});

test('Single test suite with nested tests. Startup and cleanup added at both parent & child level', function (suite) {
    suite.before(function (handle) {
        spyChildBefore();
        handle.end();
    });

    suite.after(function (handle) {
        spyChildAfter();
        handle.end();
    });

    suite.test('Child test (1/2). Startup and cleanup added at both parent & child level', function (t) {
        t.equal(spyParentBefore.callCount, 1, 'Parent Before Hook was called once');
        t.equal(spyChildBefore.callCount, 1, 'Child Before Hook was called once');
        t.ok(spyParentBefore.calledBefore(spyChildBefore), 'Parent before hook was invoked before child before hook');
        resetAllStartupSpies();
        t.end();
    });

    suite.test('Child test (2/2). Startup and cleanup added at both parent & child level', function (t) {
        t.notOk(spyParentBefore.called, 'Parent Before-Hook should only be called before first child');
        t.equal(spyChildBefore.callCount, 1, 'Child Before-Hook was called');
        t.equal(spyChildAfter.callCount, 1, 'Child After-Hook was called after Child-1 was executed');
        resetAllCleanupSpies();
        t.end();

        // Intentional asynchronous assert for cleanup hooks after test ends
        setTimeout(function () {
            t.equal(spyChildAfter.callCount, 1, 'Child-After-Hook was called after Child-2 was completed');
            t.equal(spyParentAfter.callCount, 1, 'Parent-After-Hook was called once after last child test case was executed');
            t.ok(spyChildAfter.calledBefore(spyParentAfter), 'Child-After-Hook called before Parent-After-Hook');
        }, 1);
    });
});




