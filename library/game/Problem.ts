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


        static fromObject(obj:{}):Problem {
            var prob = new Problem();

            prob.classes = obj["Classes"]
            prob.ident = obj["Ident"];
            prob.title = obj["Title"];
            prob.results = obj["TestResults"].map((r) => { return TestResult.fromObject(r) });

            return prob;
        }


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

        get isRoot():boolean {
            return this.ident == Case.ROOT_IDENT;
        }

        get(key:string):TestResult {
            for(var i in this.results)
                if(this.results[i].key == key)
                    return this.results[i];

            return null;
        }

        cloneEmpty(results=false) {

            var problem = new Problem();

            problem.ident = this.ident;
            problem.title = this.title;
            problem.classes = this.classes.concat([]);

            return problem;
        }

    }
}















