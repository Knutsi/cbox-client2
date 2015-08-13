/**
 * Created by knutsi on 07/08/15.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class Problem {

        ident:string;
        title:string;
        classes:string[] = ["General"];
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

        addResultQuick(key, value, type="TEXT", prefix = null) {
            var result = new TestResult();
            result.key = key;
            result.values[0] = value;
            result.prefix = prefix;

            this.addResult(result);
        }
    }
}