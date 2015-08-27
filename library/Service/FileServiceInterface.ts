/**
 * Created by knut on 8/7/2015.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    /***
     * ServiceInterface that emulates a server and loads full case from
     * files on a server.
     */
    export class FileServiceInterface implements IServiceInterface  {

        serviceRoot:string;
        caseCount:number;
        fullCase:Case;
        committedActions:ActionProblemPair[] = [];
        committedDiagnosis:Diagnosis[] = [];
        committedTreatments:TreatmentChoice[] = [];
        committedFollowups:FollowupQuestion[] = [];
        revealedProblems:Problem[] = [];

        constructor(serviceroot, casecount) {
            this.serviceRoot = serviceroot;
            this.caseCount = casecount;
        }

        loadManifesto(callback) {

            var url =  this.serviceRoot + "case/manifesto.json";
            var req = new XMLHttpRequest();
            req.open("GET", url, true);

            req.onreadystatechange = () => {

                if(req.status == 200 && req.readyState == 4) {
                    // parse manifest:
                    var manifest = <any>JSON.parse(req.responseText);
                    this.caseCount = parseInt(manifest["CaseCount"]);
                    console.log("Manifesto loaded");
                    callback();
                }
            };

            req.send();
        }


        /**
         * For the file interface, we need to load a file with the full case once the game starts
         * */
        startGame(
            specs:any,
            callback:(status:AsyncRequestResult, case_:Case)=>void)
        {
            // load manifesto, then case:
            this.loadManifesto( () => {

                var url =  this.serviceRoot + "case/" + Math.round(Math.random() * (this.caseCount - 1))+ ".json";
                var req = new XMLHttpRequest();
                req.open("GET", url, true);

                req.onreadystatechange = () => {

                    if(req.status == 200 && req.readyState == 4) {

                        this.handleCompleteCaseDataRecieved(req.responseText);
                        this.revealedProblems.push(this.fullCase.rootProblem);

                        // autotrigger problems:
                        var case_  = this.fullCase.makeInitial();
                        //var problems = case_.problems;
                        this.appendTriggeredProblems(case_.problems, this.fullCase);
                        //case_.problems = problems;

                        callback(new AsyncRequestResult(true), case_);

                    } else if(req.readyState == 4) {

                        alert("Case loading failed.  Cannot recover from this error.");

                    }
                };

                // go go gadget async request!
                req.send();

            });


        }


        /**
         * Concatinates the current committed actions with the new ones.  Then extracts the scorecard and
         * case to give the player.
         * **/
        commitActions(
            actions:ActionProblemPair[],
            callback:(p1:cbox.AsyncRequestResult, p2:cbox.Problem[], p3:cbox.Asset[], p4:cbox.Scorecard)=>void)
        {

            this.committedActions = this.committedActions.concat(actions);

            // extract results based on the action problem pairs:
            var results = this.fullCase.extract(actions);
            this.appendTriggeredProblems(results, this.fullCase);


            callback(
                new AsyncRequestResult(true),
                results,
                [],
                this.scorecard
            );

        }


        /**
         * Saves the subsmitted diagnosis and treatments, then sends the followup-questions from
         * **/
        commitDnT(
            diagnosis:cbox.Diagnosis[],
            treatments:cbox.TreatmentChoice[],
            callback:(p1:cbox.AsyncRequestResult, p2:cbox.FollowupQuestion[])=>void)
        {
            // save commited data:
            this.committedDiagnosis = diagnosis;
            this.committedTreatments = treatments;

            // send followup questions:
            callback(new AsyncRequestResult(true), this.fullCase.followup);
        }

        /**
         * Commits followup questions and returns final score.
         * **/
        commitFollowup(
            followup:cbox.FollowupQuestion[],
            callback:(p1:cbox.AsyncRequestResult, p2:cbox.FinalScore)=>void)
        {
            this.committedFollowups = followup;
            callback(new AsyncRequestResult(true), this.finalScore)
        }


        handleCompleteCaseDataRecieved(datastr:string) {
            var data = JSON.parse(datastr);
            this.fullCase = Case.fromObject(data);
        }


        /**
         * Scorecard calculated on basis of the current commits
         * **/
        get scorecard():Scorecard {
            return new Scorecard();
        }


        /**
         * Scorecard calculated on basis of the current commits
         * **/
        get finalScore():FinalScore {

            var fs = new FinalScore();
            var calculator = new FinalScoreCalculation(
                this.fullCase,
                this.committedDiagnosis,
                this.committedTreatments,
                this.committedFollowups);

            fs.calculationComments = calculator.calulationComments;
            fs.percentage = calculator.percentage;
            fs.points = calculator.playerScore;

            console.log(calculator);

            return fs;
        }

        get revealedProblemIdents():string[] {
            return this.revealedProblems.map( (p) => { return p.ident });
        }


        appendTriggeredProblems(results:Problem[], fullCase:Case) {

            // get all keys:
            var all_keys = [];
            results.forEach((p) => {
                all_keys = all_keys.concat(p.keys)
            });


            // check if any of the keys trigger any of the problems:
            fullCase.triggerConditions.forEach( (triggcon) => {
                if(all_keys.indexOf(triggcon.key) != -1) {

                    // this triggers a problem - see if it is already known:
                    if(this.revealedProblemIdents.indexOf(triggcon.problemTriggered.ident) == -1) {

                        // problem is unknown, add it:
                        var revealed_problem = triggcon.problemTriggered.cloneEmpty()
                        results.push(revealed_problem);

                        // for this problem, look up the keys triggered by the reveal:
                        triggcon.autotriggerKeys.forEach((autokey) => {

                            var result = this.fullCase.getResult(revealed_problem.ident, autokey);
                            if(result)
                                revealed_problem.addResult(result);
                        });
                    }

                }
            })

        }

    }

}