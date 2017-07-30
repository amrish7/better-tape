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

const spyBefore = provisionStartupSpy();
const spyAfter = provisionCleanupSpy();

test.before(function (handle) {
    spyBefore();
    handle.end();
});

test('Test with startup and cleanup run in order', function (t) {
    t.equal(spyBefore.callCount, 1, 'Before hook was called once');
    t.end();

    // Intentional asynchronous assert for cleanup hooks
    setTimeout(function () {
        t.equal(spyAfter.callCount, 1, 'After hook was called once');
        t.ok(spyAfter.calledAfter(spyBefore), 'After hook was called after Before hook');
    });
});

test.after(function (handle) {
    spyAfter();
    handle.end();
});



