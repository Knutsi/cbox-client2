/**
 * Created by knut on 8/2/2015.
 */

/// <reference path="ScreenManager.ts"> />
/// <reference path="Event.ts"> />

module cbox {

    export class Screen {

        ident:string;
        title:string;
        root:HTMLElement;

        // events for state transitions:
        onPreActivated:Event<GenericEventArgs> = new Event<GenericEventArgs>();
        onActivated:Event<GenericEventArgs> = new Event<GenericEventArgs>();
        onPreDeactivated:Event<GenericEventArgs> = new Event<GenericEventArgs>();
        onDeactivated:Event<GenericEventArgs> = new Event<GenericEventArgs>();

        constructor(ident:string, title:string, root:HTMLElement) {
            this.ident = ident;
            this.title = title;
            this.root = root;

            this.created();
        }


        public created()  {}
        public preActivate() {}
        public activated(args:string[]) {}
        public preDeactivate() {}
        public deactivated() {}
    }
}