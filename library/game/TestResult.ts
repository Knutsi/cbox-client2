/**
 * Created by knut on 8/7/2015.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class TestResult {
        key:string;
        type:string;
        values:string[] = [];
        prefix:string;

        // values for context tracking and highlighting:
        actionContext:Action = null; // the action context the value was requested in:
        committedInVersion:number = 0; // the number of the commit that yielded the value


        static fromObject(obj:{}):TestResult {
            var result = new TestResult();

            result.key = obj["Key"];
            result.values = obj["Values"];

            return result;
        }


        get displayString():string {
            if(!this.prefix)
                return this.values[0];
            else
                return this.prefix + " " + this.values[0];
        }
    }
}