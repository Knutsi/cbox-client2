/**
 * Created by knutsi on 24/07/15.
 */

/// <reference path="EventSubscription.ts" />

module cbox {

    export class Event<T> {

        listeners:EventSubscription[] = [];


        /***
         * Subscribes to the event.
         * @param callback
         * @param reference Used to later unsubscribe from event.
         */
        public subscribe(callback:(arg: T) => void, reference:any = null) {
            var sub = new EventSubscription();
            sub.callback = callback;
            sub.reference = reference;

            this.listeners.push(sub);
        }


        /***
         * Ubsubscribes from event by reference
         * @param reference
         */
        public unsubscribe(reference:any) {

            if(!reference)
                throw "Cannot unsubscribe without valid reference.  Reference is: " + reference;

            // find relevant subscription:
            var index = -1;
            for(var i in this.listeners)
                if(this.listeners[i].reference == reference)
                    index = i;

            // remove it:
            this.listeners.splice(index, 1);
        }


        /***
         * Fires the event, optionally with an argument.
         * @param arg
         */
        public fire(arg:T = null) {
            for(var i in this.listeners) {
                try {
                    this.listeners[i].callback(arg)
                }
                catch(e) {
                    throw "Event callback culd not be called.  Dumping exception and subscription reference";
                    console.log(e);
                    console.log(this.listeners[i].reference);
                }
            }
        }
    }

    // basic events:
    export class GenericEventArgs {}

}