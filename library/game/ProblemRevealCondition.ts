/**
 * Created by knut on 8/23/2015.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class ProblemRevealCondition {

        key:string;
        autotriggerKeys:string[] = [];
        problemTriggered:Problem;


        static fromObject(obj:{}, parent:Problem):ProblemRevealCondition {

            var trigger = new ProblemRevealCondition();

            trigger.key = obj['Key'];
            trigger.autotriggerKeys = obj['Autotriggers'];
            trigger.problemTriggered = parent;

            return trigger;
        }

    }
}