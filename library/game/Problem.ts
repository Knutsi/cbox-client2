/**
 * Created by knutsi on 07/08/15.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class Problem {

        ident:string;
        results:TestResult[] = [];

        addResult(result:TestResult) {
            throw "Not implemented";
        }
    }
}