/**
 * Created by knut on 8/5/2015.
 */

/// <reference path="../cboxclient.ts" />


module cbox {

    export class GameClient extends StateMachine {

        pendingActions:cbox.BindingList<PendingAction>;

        constructor() {
            super();

            this.pendingActions = new cbox.BindingList<PendingAction>();

            // setup:
            this.setupStates();
        }

        setupStates() {
            this.registerState(GameClientState.UNINITILIAZED, [GameClientState.LOADING]);
            this.registerState(GameClientState.LOADING, [GameClientState.READY]);
            this.registerState(GameClientState.READY, [GameClientState.PLAYING_CASE]);
            this.registerState(GameClientState.PLAYING_CASE, [GameClientState.PLAYING_FOLLOWUP]);
            this.registerState(GameClientState.PLAYING_FOLLOWUP, [GameClientState.SCORE_AND_COMMENT]);
            this.registerState(GameClientState.SCORE_AND_COMMENT, [GameClientState.READY]);
        }



    }

}