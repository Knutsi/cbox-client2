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
class GameClientTest extends UnitTest.Test {


    TestGameClientStates() {

       this.assertTrue(true);
    }

}


var gameclient_test = new GameClientTest("GameClient");
