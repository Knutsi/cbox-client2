/**
 * Created by knut on 8/26/2015.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class FinalScoreCalculationGroup {

        static MAX_GROUP_SCORE = 10;

        group:string;
        dxes:CaseDiagnosis[] = [];
        playerScore:number = 0;
        playerScoreTrigger: Diagnosis;
        playerScoreSkippedAsEqual:Diagnosis[] = [];
        playerScoreSkippedAsLower: Diagnosis[] = [];
        playerScoreSkippedAsMinor: Diagnosis[] = [];


        get maxScore():number {

            var score = 0;
            this.dxes.forEach((dx) => {

                if(dx.major && dx.specific)
                    score += FinalScoreCalculationGroup.MAX_GROUP_SCORE;    // 10 point for major and specific
                else if(dx.major)
                    score += 5;     // 5 points for major alone

            });

            if(score > FinalScoreCalculationGroup.MAX_GROUP_SCORE)
                score = FinalScoreCalculationGroup.MAX_GROUP_SCORE; // max 10 points in each group

            return score;
        }


        scoreChoice(player_dx:Diagnosis) {

            this.dxes.forEach( (group_dx:CaseDiagnosis) => {

                // check if in group and major:
                if(player_dx.code == group_dx.code && group_dx.major) {

                    // check if specific:
                    if(group_dx.specific) {
                        this.playerScore = FinalScoreCalculationGroup.MAX_GROUP_SCORE;
                        this.playerScoreTrigger = player_dx;
                    }
                    else {

                        // major, but not specific:
                        if(this.playerScore >= FinalScoreCalculationGroup.MAX_GROUP_SCORE)
                            this.playerScoreSkippedAsLower.push(player_dx); // skipped as lower
                        else {
                            this.playerScore = FinalScoreCalculationGroup.MAX_GROUP_SCORE / 2;
                            this.playerScoreTrigger = player_dx;
                        }
                    }
                }
                else if (player_dx.code == group_dx.code && !group_dx.major) {
                    this.playerScoreSkippedAsMinor.push(player_dx);
                }

            });
        }

    }

}