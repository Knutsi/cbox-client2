/**
 * Created by knutsi on 07/08/15.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class Problem {

        ident:string;
        results:TestResult[] = [];

        addResult(result:TestResult) {

            // if value exists, we replace it:
            for(var i in this.results)
                if(this.results[i].key == result.key) {
                    this.results[i] = result;
                    return;
                }

            // if not, we add it:
            this.results.push(result);
        }
    }
}