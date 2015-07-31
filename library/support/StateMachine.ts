/**
 * Created by knutsi on 24/07/15.
 */

/// <reference path="Event.ts" />
/// <reference path="StateMachineTransition.ts" />


module cbox {

    /***
     * State machine fires events on transitions, keeps a record of what state it is
     * currently in.
     */
    export class StateMachine {

        // state:
        currentState:string;
        stateHistory:string[] = [];
        validStates:string[] = [];
        validTransitions:StateMachineTransition[] = [];

        // events:
        onPreStateChange:Event<StateMachineTransitionEventArgs> = new Event<StateMachineTransitionEventArgs>();
        onStateChange:Event<StateMachineTransitionEventArgs> = new Event<StateMachineTransitionEventArgs>();


        registerState(state:string, legal_transitions:string[] = []) {
            if(this.validStates.indexOf(state) != -1)
                throw "StateMachine: Registering state that already exists";

            // register the state:
            this.validStates.push(state);

            // add transitions for the for this state:
            legal_transitions.forEach( (to_state) => {
                this.registerValidTransition(state, to_state)
            });
        }


        registerValidTransition(from:string, to:string) {
            this.validTransitions.push(new StateMachineTransition(from,to));
        }


        getTransition(from:string, to:string) {
            var found:StateMachineTransition = null;

            this.validTransitions.forEach((trans) => {
                if(trans.from == from && trans.to == to)
                    found = trans;
            })

            return found;
        }


        /***
         * Sets the state machine to it's initial state.
         * @param state
         */
        init(state:string) {
            if(this.currentState)
                throw "StateMachine: cannot run init when machine already has state";

            this.currentState = state;
        }


        /***
         *
         * @param state
         */
        go(state:string) {
            if(!this.currentState)
                throw "StateMachine: go called on machine with no state - forgot to run init()?";

            // check that the state transition is legal:
            if(!this.getTransition(this.currentState, state))
                throw "StateMachine: illegal state transition " + this.currentState + " -> " + state;

            console.log("StateMachine: " + this.currentState + " -> " + state);

            // notify we are about to change:
            var ev_args = new StateMachineTransitionEventArgs(this.currentState, state);
            this.onPreStateChange.fire(ev_args);

            // perform the change:
            this.stateHistory.push(this.currentState);
            this.currentState = state;

            // notify we have changed:
            this.onStateChange.fire(ev_args);


        }

    }

    /***
     * Contains information about a state change.  Used as argument to state change events on the
     * StateMachine class.
     */
    export class StateMachineTransitionEventArgs extends GenericEventArgs{
        fromState:string;
        toState:string;

        constructor(from:string, to:string) {
            super();
            this.fromState = from;
            this.toState = to;
        }
    }
}