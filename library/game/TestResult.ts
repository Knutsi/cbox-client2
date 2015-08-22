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
        unit:string;
        initialReveal:boolean = false;

        // values for context tracking and highlighting:
        committedInVersion:number = 0; // the number of the commit that yielded the value


        static fromObject(obj:{}):TestResult {
            var result = new TestResult();

            result.key = obj["Key"];
            result.values = obj["Values"];
            result.prefix = obj["Prefix"];
            result.unit = obj["Unit"];

            return result;
        }


        get displayString():string {
            var prefix = "";
            var unit = "";

            if(this.prefix)
                prefix = this.prefix + " ";

            if(this.unit)
                unit = " " + this.unit + ".";

            return prefix + this.values[0] + unit;
        }
    }
}