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

function resetAllCleanupSpies() {
    for (var i=0; i<cleanupSpies.length; i++) {
        cleanupSpies[i].reset();
    }
}

test.before(function (handle) {
    spyBefore();
    handle.end();
});

test.after(function (handle) {
    spyAfter();
    handle.end();
});

test('Test (1/2) with before and after hook run in order', function (t) {
    t.equal(spyBefore.callCount, 1, 'Before hook was called once');
    resetAllStartupSpies();
    t.end();
});

test('Test (2/2) with couple of startup and cleanup run in order', function (t) {
    // Assert clean-ups for previous test case
    t.equal(spyAfter.callCount, 1, 'After hook was called once');
    resetAllCleanupSpies();

    t.equal(spyBefore.callCount, 1, 'Before hook was called once');
    resetAllStartupSpies();

    t.end();

    // Intentional asynchronous assert for cleanup hooks
    setTimeout(function () {
        t.equal(spyAfter.callCount, 1, 'After hook was called once');
    });
});

