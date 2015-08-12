/**
 * Created by knut on 8/2/2015.
 */

/// <reference path="Screen.ts"> />

module cbox {

    export class ScreenManager {

        screens:Screen[] = [];
        current:Screen = null;

        register(screen:Screen) {
            this.screens.push(screen);
        }

        activate(ident:string, sethash=true) {

            // get screen:
            var screen = this.get(ident);
            if(!screen) throw "Tried to activate unregistered screen: " + ident;

            // check we are not going to the one we are at already:
            var prev_screen = this.current;
            if(prev_screen && screen == prev_screen) return;

            // call overrides for activate and deactivate:
            if(prev_screen) {
                prev_screen.preDeactivate();
                prev_screen.onPreDeactivated.fire();
            }
            screen.preActivate();
            screen.onPreActivated.fire();

            // display by toggeling visibility:
            this.current = screen;
            this.screens.forEach((s) => { s.root.style.display = "none"; })
            screen.root.style.display = "block";

            // call overrides for post activation/deactivation:
            screen.activated();
            screen.onActivated.fire();

            if(prev_screen) {
                prev_screen.deactivated();
                prev_screen.onDeactivated.fire();
            }

            // set location hash:
            if(sethash)
                document.location.hash = ident;
        }

        get(ident:string):Screen {
            for(var i in this.screens)
                if(this.screens[i].ident == ident)
                    return this.screens[i];

            return null;
        }
    }
}