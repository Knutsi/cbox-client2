/**
 * Created by knutsi on 23/07/15.
 */

/// <reference path="../runner/resources/unittest.ts" />


/***
 * Example test to demonstrate unittest system.
 */
class ExampleTest extends UnitTest.Test {

    constructor() {
        super("Unittest system test");
        this.dependencies = [];
    }

    TestPassedTest() {
        this.assertEqual("1", "1");
    }

    TestFailedTest() {
        this.assertEqual("1", "2");
    }
}

var example_test = new ExampleTest();