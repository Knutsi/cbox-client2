/**
 * Created by knutsi on 07/08/15.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class Case {

        static ROOT_IDENT:string = "_root";
        static AGE_KEY:string = "history.age";
        static GENDER_KEY:string = "history.gender";
        static PRESENTING_COMPLAINT_KEY:string = "history.presenting.short";

        problems:Problem[] = [];
        diagnosis:Diagnosis[] = [];
        followup:FollowupQuestion[] = [9;]

        // keep track of times this has been updated:
        version = 0;

        // events:
        onUpdated:Event<GenericEventArgs> = new Event<GenericEventArgs>();


        get initial():Case {
            return this;
        }

        /**
         * Extends the case with the results anbd problems provided, then increases the verison count.
         * All test results added gets tagged with the current version number.
         * **/
        extend(new_problems:Problem[]) {

            this.version += 1;

            new_problems.forEach((new_problem) => {

                // append version number to results:
                new_problem.results.forEach((r) => { r.committedInVersion = this.version });

                // find matching problem, or add
                var problem = this.problemByIdent(new_problem.ident)
                if(!problem) {

                    // add problem as new problem:
                    problem = new_problem;
                    this.addProblem(problem);
                } else {

                    // add results to existing problem:
                    new_problem.results.forEach((result) => { problem.addResult(result);});
                }

            });

            this.onUpdated.fire(new GenericEventArgs());
        }


        extract(ap_pairs:ActionProblemPair[]):Case {
            return this;
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


        problemByIdent(ident:string) {
            for(var i in this.problems)
                if(this.problems[i].ident == ident)
                    return this.problems[i];

            return null;
        }

    }


}