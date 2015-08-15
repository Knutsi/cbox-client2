/**
 * Created by knut on 8/7/2015.
 */

module cbox {

    export class FollowupQuestion {

        static TYPE_MULTIPLE_CHOICE = "checkbox";
        static TYPE_SINGLE_CHOICE = "radio";

        type:string;
        question:string;
        options:string[] = [];
        userAnswerIndexes:number[] = [];
    }
}