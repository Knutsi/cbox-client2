/**
 * Created by knutsi on 23/07/15.
 */

/// <reference path="../runner/resources/unittest.ts" />
/// <reference path="../../library/cboxclient.ts" />


/***
 * Example test to demonstrate unittest system.
 */
class EventTest extends UnitTest.Test {

    genericfired = false;
    genericfired2 = false;
    customfired = false;

    reftest_a_fired = false;
    reftest_b_fired = false;


    constructor() {
        super("Event system test");
        this.dependencies = [];
    }

    TestTrigger() {
        var emitter = new EventEmitter();

        emitter.onunittest.subscribe( () => { this.genericfired = true }, this);
        emitter.onunittest.subscribe( () => { this.genericfired2 = true }, this);

        emitter.oncustom.subscribe( (arg) => {
            if(arg.answer == 42)
                this.customfired = true
        }, this);

        emitter.fireEvents();

        // check that first event fired twice, and so with second:
        this.assertTrue(this.genericfired);
        this.assertTrue(this.genericfired2);
        this.assertTrue(this.customfired);
    }


    TestRemoveByReference() {
        var obj_a = {};
        var obj_b = {};

        var emitter = new EventEmitter();
        emitter.onunittest.subscribe( () => { this.reftest_a_fired = true }, obj_a );
        emitter.onunittest.subscribe( () => { this.reftest_b_fired = true }, obj_b );

        // fire both, reset:
        emitter.fireEvents();
        this.assertTrue(this.reftest_a_fired);
        this.assertTrue(this.reftest_b_fired);
        this.reftest_a_fired = false;
        this.reftest_b_fired = true;

        // remove by reference to object a, check that only b is fired:
        emitter.onunittest.unsubscribe(obj_a);
        emitter.fireEvents();
        this.assertNotTrue(this.reftest_a_fired);
        this.assertTrue(this.reftest_b_fired);

    }
}


class EventEmitter {

    onunittest:cbox.Event<cbox.GenericEventArgs> = new cbox.Event<cbox.GenericEventArgs>();
    oncustom:cbox.Event<MyCustomEvent> = new cbox.Event<MyCustomEvent>();

    fireEvents() {
        this.onunittest.fire(null);
        this.oncustom.fire(new MyCustomEvent(42));
    }
}


class MyCustomEvent {

    answer:number;

    constructor(answer:number) {
        this.answer = answer;
    }
}


var event_test = new EventTest();