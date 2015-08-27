/**
 * Created by knut on 8/26/2015.
 */


module cbox {

    export class FollowupQuestionAnswer {

        text:string;
        correct:boolean;
        chosen:boolean;

        static fromObject(obj:{}):FollowupQuestionAnswer {

            var answer = new FollowupQuestionAnswer();

            answer.text = obj['Text'];
            answer.correct = obj['Correct'];
            answer.chosen = false;

            return answer;
        }

    }


}