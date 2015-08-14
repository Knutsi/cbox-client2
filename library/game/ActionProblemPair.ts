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

        get displayName():string {
            if(this.problem.isRoot)
                return this.action.title;
            else
                return this.action.title + " (" + this.problem.title + ")";
        }

    }


}