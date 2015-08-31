/**
 * Created by knut on 8/31/2015.
 */

module cbox {

    export class Result {

        score:number = 0;
        maxScore:number = 0;
        scoreExplanation:string[] = [];
        comments:string[] = [];

        get percentage():number {
            return Math.round((this.score / this.maxScore) * 100);
        }
    }


}