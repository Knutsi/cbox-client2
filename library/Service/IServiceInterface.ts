/**
 * Created by knut on 8/7/2015.
 */

/// <reference path="../cboxclient.ts" />

 module cbox {

    export interface IServiceInterface {

        startGame(specs:any, callback:(status:AsyncRequestResult, case_:Case) => void);

        commitActions(
            actions:any,
            callback:(
                status:AsyncRequestResult,
                result:Problem[],
                assets:Asset[],
                score:Scorecard) => void);

        commitDnT(
            diagnosis:DiagnosisChoice[],
            treatments:TreatmentChoice[], callback:(
                status:AsyncRequestResult,
                questions:FollowupQuestion[]) => void);


        commitFollowup(
            followup:FollowupQuestion[], callback:(
                status:AsyncRequestResult,
                score:Scorecard,
                comments:string[]) => void );
    }

}