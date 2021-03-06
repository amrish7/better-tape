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

const spyChild1Before = provisionStartupSpy();
const spyChild2Before = provisionStartupSpy();
const spyChild1After = provisionCleanupSpy();
const spyChild2After = provisionCleanupSpy();

test.before(function (handle) {
    spyParentBefore();
    handle.end();
});

test.after(function (handle) {
    spyParentAfter();
    handle.end();
});

test('Parent test (1/2) with 2 nested tests. Startup and cleanup added at both parent & child level', function (suite) {
    suite.before(function (handle) {
        spyChild1Before();
        handle.end();
    });

    suite.after(function (handle) {
        spyChild1After();
        handle.end();
    });

    suite.test('Child test (1/2). Startup and cleanup added at both parent & child level', function (t) {
        t.equal(spyParentBefore.callCount, 1, 'Parent Before Hook was called once');
        t.equal(spyChild1Before.callCount, 1, 'Child Before Hook was called once');
        t.ok(spyParentBefore.calledBefore(spyChild1Before), 'Parent before hook was invoked before child before hook');
        resetAllStartupSpies();
        t.end();
    });

    suite.test('Child test (2/2). Startup and cleanup added at both parent & child level', function (t) {
        t.notOk(spyParentBefore.called, 'Parent Before-Hook should only be called before first child');
        t.equal(spyChild1Before.callCount, 1, 'Child Before-Hook was called');
        t.equal(spyChild1After.callCount, 1, 'Child After-Hook was called after Child-1 was executed');
        resetAllStartupSpies();
        resetAllCleanupSpies();
        t.end();
    });
});

test('Parent test (2/2) with 2 nested tests. Startup and cleanup added at both parent & child level', function (suite) {
    suite.before(function (handle) {
        spyChild2Before();
        handle.end();
    });

    suite.after(function (handle) {
        spyChild2After();
        handle.end();
    });

    suite.test('Child test (1/2). Startup and cleanup added at both parent & child level', function (t) {
        // Asserts for clean-up that was performed on the last sibling of Parent test (2/2)
        t.equal(spyChild1After.callCount, 1, 'Child-After-Hook was called after Child-2 was completed');
        t.equal(spyParentAfter.callCount, 1, 'Parent-After-Hook was called once after last child test case was executed');
        t.ok(spyChild1After.calledBefore(spyParentAfter), 'Child-After-Hook called before Parent-After-Hook');
        resetAllCleanupSpies();

        // Parent startup hook should be called once before first child
        t.equal(spyParentBefore.callCount, 1, 'Parent Before Hook was called once');
        t.notOk(spyChild1Before.called, 'Child-1-Before-Hook should not have been called');
        t.ok(spyChild2Before.called, 'Child-2-Before-Hook was called once');
        resetAllStartupSpies();
        t.end();
    });

    suite.test('Child test (2/2). Startup and cleanup added at both parent & child level', function (t) {
        // Parent hooks should not have been called between child nodes
        t.notOk(spyParentBefore.called, 'Parent Before-Hook should only be called before first child');

        // Asserts for clean-up that was performed on previous sibling
        t.equal(spyChild2After.callCount, 1, 'Child-2-After-Hook was called after Child-2 was completed');
        resetAllCleanupSpies();

        t.equal(spyChild2Before.callCount, 1, 'Child-2-Before-Hook was called once');
        resetAllStartupSpies();
        t.end();

        // Intentional asynchronous assert for cleanup hooks after last child test
        setTimeout(function () {
            t.equal(spyChild2After.callCount, 1, 'Child-2-After-Hook was called after Child-2 was completed');
            t.equal(spyParentAfter.callCount, 1, 'Parent-After-Hook was called once after last child test case was executed');
            t.ok(spyChild2After.calledBefore(spyParentAfter), 'Child-2-After-Hook called before Parent-After-Hook');
        }, 1);
    });
});



