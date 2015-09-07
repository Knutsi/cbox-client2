/**
 * Created by knut on 8/15/2015.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class FinalScore {
        points:number = 0;
        percentage:number;
        calculationComments:string[] = ["-"];
        caseComments:string[] = ["-"];
        scorecard:Scorecard;
    }

}