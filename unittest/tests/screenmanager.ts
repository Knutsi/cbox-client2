/**
 * Created by knut on 8/2/2015.
 */
/**
 * Created by knutsi on 23/07/15.
 */

/// <reference path="../runner/resources/unittest.ts" />
/// <reference path="../../library/cboxclient.ts" />



/***
 * Example test to demonstrate unittest system.
 */
class ScreenManagerTest extends UnitTest.Test {

    constructor() {
        super("Screen manager");
    }

    TestScreenManagement() {
        /***
         * ScreenManager works by taking objects that inherit from Screen and toggeling them on
         * and off.  Only only screen can be open at a time.  The screen objects override
         * the five methods of the class to enable behaviour such as created() and activated().
         * Screens also have events that it's child-elements can listen for.
         */

        // create screens:
        this.output1.innerHTML = "Screen A";
        this.output2.innerHTML = "Screen B"
        var screen_a = new ScreenA("A", "Screen A", this.output1);
        var screen_b = new ScreenB("B", "Screen B", this.output2);

        var manager = new cbox.ScreenManager();
        manager.register(screen_a);
        manager.register(screen_b);

        // for manual testing:
        var abutton = document.createElement("button");
        var bbutton = document.createElement("button");
        this.output3.appendChild(abutton);
        this.output3.appendChild(bbutton);
        abutton.innerHTML = "Activate A";
        bbutton.innerHTML = "Activate B";

        abutton.onclick = () => { manager.activate("A"); this.output4.innerHTML += "<br />A active"; };
        bbutton.onclick = () => { manager.activate("B"); this.output4.innerHTML += "<br />B active"; };

        // switch to screen A, assert it is shown:
        manager.activate("A");
        this.assertTrue(manager.current == screen_a);
        this.assertEqual(screen_a.root.style.display, "block");
        this.assertEqual(screen_b.root.style.display, "none");

        // switch to screen B, assert only B is showing:
        manager.activate("B");
        this.assertTrue(manager.current == screen_b);
        this.assertEqual(screen_a.root.style.display, "none");
        this.assertEqual(screen_b.root.style.display, "block");

        // switch to screen A, assert it is shown:
        manager.activate("A");
        this.assertTrue(manager.current == screen_a);
        this.assertEqual(screen_a.root.style.display, "block");
        this.assertEqual(screen_b.root.style.display, "none");

        // assert that callbacks gets called:
        this.assertTrue(screen_a._activated && screen_a._deactivated);
        this.assertTrue(screen_b._activated && screen_b._deactivated);
    }
}

class ScreenA extends cbox.Screen {

    _activated = false;
    _deactivated = false;

    public activated() {
        this._activated = true;
    }

    public deactivated() {
        this._deactivated = true;
    }

}

class ScreenB extends cbox.Screen {

    _activated = false;
    _deactivated = false;

    template:cbox.Template;

    public created() {
        this.template = new cbox.Template([
            "h1",
            "-'Screen A'",
            "p",
            "-'I am a paragraph!'"
        ]);
        var output = this.template.render(this);
        this.root.appendChild(output);
    }

    public activated() {
        this._activated = true;
    }

    public deactivated() {
        this._deactivated = true;
    }
}

var screen_manager_test = new ScreenManagerTest();