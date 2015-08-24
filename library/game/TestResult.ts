/**
 * Created by knut on 8/7/2015.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class TestResult {

        static TYPE_NUMBER = "NUMBER";

        key:string;
        type:string;
        values:string[] = [];
        prefix:string;
        unit:string;
        abnormal:boolean = false;
        parentKey:string;
        parentResult:TestResult;
        childResults:TestResult[] = [];
        //initialReveal:boolean = false;

        // values for context tracking and highlighting:
        committedInVersion:number = 0; // the number of the commit that yielded the value


        static fromObject(obj:{}):TestResult {
            var result = new TestResult();

            result.key = obj["Key"];
            result.values = obj["Values"];
            result.prefix = obj["Prefix"];
            result.unit = obj["Unit"];
            result.abnormal = obj["Abnormal"];

            result.parentKey = obj["ParentKey"];

            return result;
        }


        get displayStringHTML():string {
            var prefix = "";
            var unit = "";
            var abnormal_flag = "";

            if(this.prefix)
                prefix = this.prefix + ": ";

            if(this.unit)
                unit = " " + this.unit + ".";

            if(this.isLabValue && this.abnormal)
                abnormal_flag = "<span class=\"abnormal_mark\">*</span>";

            return prefix + this.values[0] + abnormal_flag + unit;
        }


        get siblingResults():TestResult[] {

            if(this.parentResult)
                return this.parentResult.childResults;

            return [];
        }


        get hasAbnormalChildren():boolean {
            return this.childResults.some((r) => { return r.abnormal });
        }


        get hasChildren():boolean {
            return this.childResults.length > 0;
        }

        get hasAbnormalSiblings():boolean {
            return this.siblingResults.some((r) => { return r.abnormal });
        }


        get isLabValue():boolean {
            if(this.key.indexOf("lab.") == 0)
                return true;
            else
                return false;
        }
    }
}