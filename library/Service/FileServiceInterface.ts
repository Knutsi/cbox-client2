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

            var url =  this.serviceRoot + "/case/" + Math.round(Math.random() * this.caseCount);
            var req = new XMLHttpRequest();
            req.open("GET", url, true);

            req.onreadystatechange = () => {

                if(req.status == 200 && req.readyState == 4) {
                    this.handleCompleteCaseDataRecieved(req.responseText);
                    callback(new AsyncRequestResult(true), this.fullCase.initialCase);
                } else if(req.readyState == 4) {
                    alert("Case loading failed.  Cannot recover from this error.");
                }

            }

        }

        commitActions(
            actions:any,
            callback:(p1:cbox.AsyncRequestResult, p2:cbox.Problem[], p3:cbox.Asset[], p4:cbox.Scorecard)=>void)
        {

        }

        commitDnT(
            diagnosis:cbox.DiagnosisChoice[],
            treatments:cbox.TreatmentChoice[],
            callback:(p1:cbox.AsyncRequestResult, p2:cbox.FollowupQuestion[])=>void)
        {

        }

        commitFollowup(
            followup:cbox.FollowupQuestion[],
            callback:(p1:cbox.AsyncRequestResult, p1:cbox.FinalScore)=>void)
        {

        }


        handleCompleteCaseDataRecieved(datastr:string) {
            var data = JSON.parse(datastr);
            this.fullCase = FileGameState.createNew(data);
        }


    }

}