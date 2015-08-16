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

        constructor(serviceroot, casecount) {
            this.serviceRoot = serviceroot;
            this.caseCount = casecount;
        }

        /**
         * For the file interface, we need to load a file with the full case once the game starts
         * */
        startGame(
            specs:any,
            callback:(status:AsyncRequestResult, case_:Case)=>void)
        {

            var url =  this.serviceRoot + "/case/" + Math.round(Math.random() * this.caseCount) + ".json";
            var req = new XMLHttpRequest();
            req.open("GET", url, true);

            req.onreadystatechange = () => {

                if(req.status == 200 && req.readyState == 4) {
                    this.handleCompleteCaseDataRecieved(req.responseText);
                    callback(new AsyncRequestResult(true), this.fullCase.initial);
                } else if(req.readyState == 4) {
                    alert("Case loading failed.  Cannot recover from this error.");
                }
            };

            // go go gadget async request!
            req.send();
        }


        /**
         * Concatinates the current committed actions with the new ones.  THen extractx the scorecard and
         * case to give the player.
         * **/
        commitActions(
            actions:ActionProblemPair[],
            callback:(p1:cbox.AsyncRequestResult, p2:cbox.Problem[], p3:cbox.Asset[], p4:cbox.Scorecard)=>void)
        {

            this.committedActions = this.committedActions.concat(actions);
            callback(
                new AsyncRequestResult(true),
                this.fullCase.extract(actions),
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
            return new FinalScore();
        }

    }

}