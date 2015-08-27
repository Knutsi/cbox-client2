/**
 * Created by knut on 8/7/2015.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class FollowupQuestion {

        static TYPE_MULTIPLE_CHOICE = "TYPE_MULTIPLE_CHOICE";
        static TYPE_SINGLE_CHOICE = "TYPE_SINGLE_CHOICE";

        type:string;
        question:string;
        answers:FollowupQuestionAnswer[] = [];
        userAnswerIndexes:number[] = [];


        static fromObject(obj:{}):FollowupQuestion {

            var followup = new FollowupQuestion();

            followup.type = obj['Type'];
            followup.question = obj['Question'];
            followup.answers = obj['Answers'].map( (a) => { return FollowupQuestionAnswer.fromObject(a) });

            return followup;
        }
    }
}