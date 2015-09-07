/**
 * Created by knut on 9/6/2015.
 */


/// <reference path="../runner/resources/unittest.ts" />
/// <reference path="../../library/cboxclient.ts" />

/***
 * Example test to demonstrate unittest system.
 */
class Scorekeeper extends UnitTest.Test {

    TestPercentage() {

        var scorekeeper = new cbox.Scorekeeper();
        var card = new cbox.Scorecard();

        // add multiple percentages, see output:
        scorekeeper.add("TEST", card, 0.5);
        scorekeeper.add("TEST", card, 0.5);
        scorekeeper.add("TEST", card, 0.5);

        this.assertEqual(scorekeeper.getStanding("TEST"), 0.5);
    }

}


var scorekeeper_test = new Scorekeeper("Scorekeeper");