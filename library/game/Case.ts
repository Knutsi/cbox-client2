/**
 * Created by knutsi on 07/08/15.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class Case {

        results:TestResult[] = [];
        problems:Problem[] = [];
        rootProblem:Problem;

        extend(new_results:TestResult[]) {

            new_results.forEach( (r) => {

                // FIXME - check result does not already exist on case!
                this.results.push(r);
            } )
        }

    }


}