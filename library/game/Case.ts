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
        diagnosis:CaseDiagnosis[] = [];
        followup:FollowupQuestion[] = [];
        comments:string[] = [];
        scoreTree:ScoreTree;
        resourceStatGroup:string;

        // keep track of times this has been updated:
        version = 0;

        // events:
        onUpdated:Event<GenericEventArgs> = new Event<GenericEventArgs>();

        constructor(createRoot:boolean=false) {
            if(createRoot) {
                var root = new Problem();
                root.ident = Case.ROOT_IDENT;
                this.addProblem(root);
            }
        }

        static fromObject(obj:{}):Case {
            var case_ = new Case(false);

            case_.problems = obj["Problems"].map( (p) => { return Problem.fromObject(p); } );
            //case_.diagnosis = obj["Diagnosis"].map( (p) => { return CaseDiagnosis.fromObjectInherited(p); } );
            case_.comments = obj["Comments"];
            case_.scoreTree = ScoreTree.fromObject(obj["ScoreTree"]);
            case_.followup = obj["Followup"].map( (p) => { return FollowupQuestion.fromObject(p); } );
            case_.resourceStatGroup = obj["ResourceScoreGroup"];

            case_.updateParentChildRelations();
            return case_;
        }





        makeInitial():Case {
            var case_ = new Case(true);

            // add basics:
            /*var age = this.rootProblem.get(Case.AGE_KEY);
            var gender = this.rootProblem.get(Case.GENDER_KEY);
            var presenting = this.rootProblem.get(Case.PRESENTING_COMPLAINT_KEY);
            case_.rootProblem.addResult(age);
            case_.rootProblem.addResult(gender);
            case_.rootProblem.addResult(presenting);*/

            // extend with given problems:
            /*var ap_pairs = initial_actions.map( (a) => { return new ActionProblemPair(a, this.rootProblem) } );
            case_.extend(this.extract(ap_pairs));*/

            var initials = [
                "history.age",
                "history.gender",
                "history.presenting.short",
                "clinical.general-condition",
                "clinical.skin.apperance-palor",
                "clinical.skin.touch",
                "clinical.generalized-edema",
                "clinical.generalized-lymphadenopathy",
                "clinical.neurological.orientation",
                "clinical.neurological.gcs",
                "clinical.neurological.conciousness-description",
                "clinical.neurological.cooperation"];

            initials.forEach( (k) =>  {
                var result = this.rootProblem.get(k);
                case_.rootProblem.addResult(result);
            });


            return case_;
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

            this.updateParentChildRelations();
            this.onUpdated.fire(new GenericEventArgs());
        }


        extract(ap_pairs:ActionProblemPair[]):Problem[] {

            // this will keep copies of the problems, indexed by ident:
            var results:{ [ident:string]: Problem; } = { };

            // get results and return them by problem:
            ap_pairs.forEach( (ap_pair) => {

                // ensure requested problem is in collection:
                if(!results[ap_pair.problem.ident])
                    results[ap_pair.problem.ident] = ap_pair.problem.cloneEmpty();

                // get keys from the action:
                var keys = ap_pair.action.yields;   // FIXME this should look up in ontology!

                // look up result and add to problem:
                keys.forEach( (key) => {

                    var result = this.getResult(ap_pair.problem.ident, key);
                    results[ap_pair.problem.ident].addResult(result);

                });

            });


            // get all items from results:
            var retval:Problem[] = [];
            for(var key in results)
                retval.push(results[key]);

            return retval;
        }


        get rootProblem():Problem {
            return this.getProblem(Case.ROOT_IDENT);
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


        getResult(problem_ident:string, key) {

            var problem = this.getProblem(problem_ident);
            if(!problem)
                return null;

            return problem.get(key);
        }


        getProblem(ident:string):Problem {
            for(var i in this.problems)
                if(this.problems[i].ident == ident)
                    return this.problems[i];

            return null;
        }


        getProblemTextReference(problem:Problem):string {
            var index = this.problems.indexOf(problem);
            if(index == -1)
                return "(xx)";
            else
                return "(" + String.fromCharCode(96 + index) + ")";


        }


        get triggerConditions():ProblemRevealCondition[] {

            var results = [];

            this.problems.forEach((p) => {

                // skip root problem:
                if(p.isRoot)
                    return;

                p.triggers.forEach((t) => { results.push(t) });
            })

            return results;
        }

        /****
         * Updates the parentResult and childResult fields of the results.
         */
        updateParentChildRelations() {

            // reset

            this.problems.forEach((problem) => {

                // clear existing relationships:
                problem.results.forEach((result) => {
                    result.parentResult = null;
                    result.childResults = [];
                });

                // reestablish relationships:
                problem.results.forEach((result) => {

                    // set parent - child association:
                    if(result.parentKey) {
                        var parent = problem.get(result.parentKey);
                        result.parentResult = parent;

                        if(parent)
                            parent.childResults.push(result);
                    }

                })

            })

        }

    }


}