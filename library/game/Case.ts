/**
 * Created by knutsi on 07/08/15.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class Case {

        static ROOT_IDENT:string = "_root";

        problems:Problem[] = [];

        extend(new_results:Problem[]) {

            new_results.forEach((problem) => {

                // find matching problem, or add 

            })

        }

        get rootProblem():Problem {

            for(var i in this.problems) {

                if(this.problems[i].ident == Case.ROOT_IDENT)
                    return this.problems[i];

                return null;    // should never really get here..
            }
        }

        addProblem(problem:Problem) {
            this.problems.push(problem);
        }

    }


}