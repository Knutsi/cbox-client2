/**
 * Created by knutsi on 07/08/15.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class ActionProblemPair {

        action:Action;
        problem:Problem;

        constructor(action = null, problem = null) {
            this.action = action;
            this.problem = problem;
        }

    }


}