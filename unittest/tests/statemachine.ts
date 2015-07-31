/**
 * Created by knutsi on 24/07/15.
 */

/**
 * Created by knutsi on 23/07/15.
 */

/// <reference path="../runner/resources/unittest.ts" />
/// <reference path="../../library/cboxclient.ts" />


/***
 * Example test to demonstrate unittest system.
 */
class StateMachineTest extends UnitTest.Test {

    a_b_fired = false;
    b_c_fired = false;


    TestStateTransition() {

        // register states and transitions (a can to b, b to c, and c to any):
        var m = new cbox.StateMachine();
        m.registerState("A", ["B"]);
        m.registerState("B", ["C"]);
        m.registerState("C", ["B"]);
        m.init("A");

        // add events:
        m.onStateChange.subscribe((trans) => {
            if(trans.fromState == "A" && trans.toState == "B")
                this.a_b_fired = true;

            if(trans.fromState == "B" && trans.toState == "C")
                this.b_c_fired = true;
        })

        this.assertNotTrue(this.a_b_fired);
        this.assertNotTrue(this.b_c_fired);

        // move to C in two steps:
        m.go("B");
        m.go("C");

        this.assertTrue(this.a_b_fired);
        this.assertTrue(this.b_c_fired);

        // move back to a, then try to go to C - this should raise an exception:
        this.assertExcepts(() => { m.go("A") });
    }

}


var statemachine_test = new StateMachineTest("State machine");
