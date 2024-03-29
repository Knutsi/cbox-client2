/**
 * Created by knutsi on 07/08/15.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class Action {

        cost:number;
        ident:string;
        pain:number;
        risk:number;
        time:number;
        targetClasses:string[];
        title:string;
        headlineVisibleHint:boolean;

        yields:string[];
        doesNotGroup:boolean = false;

        static fromObject(obj:{}):Action {

            var action = new Action();

            action.cost = obj["Money"];
            action.ident = obj["Ident"];
            action.pain = obj["Pain"];
            action.risk = obj["Risk"];
            action.time = parseInt(obj["Time"]);
            action.targetClasses = obj["TargetClasses"];
            action.title = obj["Title"];
            action.headlineVisibleHint = obj["VisibleHeadlineHint"];

            action.yields = obj["Yield"];
            action.doesNotGroup = obj["DoesNotGroup"] || false;

            return action;
        }


        /**
         * Checks if the action applies to the given problem.
         * **/
        appliesTo(problem:Problem):boolean {

            for(var i in this.targetClasses) {
                var class_ = this.targetClasses[i];
                if(problem.classes.indexOf(class_) != -1)
                    return true;
            }

            return false;
        }
    }

}

