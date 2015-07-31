/**
 * Created by knutsi on 28/07/15.
 */

module cbox {

    export class StateMachineTransition {

        from:string;
        to:string;

        constructor(from:string, to:string) {
            this.from = from;
            this.to = to;
        }

    }


}