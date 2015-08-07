/**
 * Created by knut on 8/7/2015.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    /****
     * Dummy service interface for flow debugging.
     */
    export class DummyServiceInterface implements IServiceInterface{

        startGame(
            specs:any,
            callback:(status:cbox.AsyncRequestResult, case_:cbox.Case)=>void)
        {
            callback(new AsyncRequestResult(true), new Case());
        }


        commitActions(
            actions:any,
            callback:(
                status:cbox.AsyncRequestResult,
                results:cbox.TestResult[],
                assets:cbox.Asset[],
                score:cbox.Scorecard)=>void)
        {
            callback(new AsyncRequestResult(true), [], [], new Scorecard());
        }


        commitDnT(
            diagnosis:cbox.DiagnosisChoice[],
            treatments:cbox.TreatmentChoice[],
            callback:(
                status:cbox.AsyncRequestResult,
                followup:cbox.FollowupQuestion[])=>void)
        {
            callback(new AsyncRequestResult(true), []);
        }


        commitFollowup(
            followup:cbox.FollowupQuestion[],
            callback:(
                status:cbox.AsyncRequestResult,
                score:cbox.Scorecard,
                comments:string[])=>void)
        {
            callback(new AsyncRequestResult(true), new Scorecard(), []);
        }

    }

}