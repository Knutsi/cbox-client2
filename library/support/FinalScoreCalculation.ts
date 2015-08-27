/**
 * Created by knut on 8/26/2015.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class FinalScoreCalculation {

        case_:Case;
        chosenDx:Diagnosis[];
        chosenRx:TreatmentChoice[];
        followupQuestions:FollowupQuestion[];
        scoreGroups:FinalScoreCalculationGroup[] = [];

        playerFollowupScore = 0;
        playerScore:number = 0;

        maxFollowupScore = 1;
        followupComments:string[] = [];

        constructor(case_:Case, chosenDx:Diagnosis[], chosenRx:TreatmentChoice[], followups:FollowupQuestion[]) {

            this.case_ = case_;
            this.chosenDx = chosenDx;
            this.chosenRx = chosenRx;
            this.followupQuestions = followups;

            this.makeScoreGroups();
            this.calculate();
        }

        makeScoreGroups() {

            // diagnosis score groups:
            var groups: { [group:string] : FinalScoreCalculationGroup; } = {};
            this.case_.diagnosis.forEach( (dx) => {

                // create group if it does not exist:
                if(!(dx.group in groups))
                    groups[dx.group] = new FinalScoreCalculationGroup();

                // add diagnosis to group:
                groups[dx.group].dxes.push(dx);
            })

            for(var i in groups)
                this.scoreGroups.push(groups[i]);
        }


        calculate() {

            // score in each group
            this.chosenDx.forEach( (dx) => {
                this.scoreGroups.forEach( (group) => {
                    group.scoreChoice(dx);
                })
            });

            // calculate final dx group score:
            this.playerScore = this.scoreGroups.reduce(
                (pv, cv) =>  {
                    return pv + cv.playerScore;
                }, 0);

            // calculate the followup answer score:
            var correct_answers_count = 0;
            var correct_chosen_count = 0;

            this.followupQuestions.forEach( (question) => {

                question.answers.forEach( (answer) => {
                    if(answer.correct)
                    {
                        correct_answers_count += 1;
                        if(answer.chosen)
                            correct_chosen_count += 1;
                    }
                });

            } );

            this.playerFollowupScore = Math.round(this.maxFollowupScore * (correct_chosen_count/correct_answers_count));
            this.playerScore += this.playerFollowupScore;
        }


        get maxScore():number {
            var dx_group_scores = this.scoreGroups.reduce((pv, cv) => { return pv + cv.maxScore }, 0);


            return dx_group_scores + this.maxFollowupScore;
        }

        get percentage():number {
            return Math.round( (this.playerScore / this.maxScore) * 100 );
        }


        get calulationComments():string[] {

            var comments:string[] = [];

            // add all diagnosis
            var dx_comment = "Gyldige diagnoser var ";
            var dxes = this.case_.diagnosis.map( (d) => { return d.title.toLowerCase() });
            dx_comment += dxes.join(", ") + ".";
            comments.push(dx_comment);

            // add scores player got:
            var scores:string[] = []
            this.scoreGroups.forEach((sg:FinalScoreCalculationGroup) => {
                if(sg.playerScore != 0)
                    scores.push(sg.playerScore + " poeng for '" + sg.playerScoreTrigger.title + "'");
            });
            if(scores.length > 0)
                comments.push("Du fikk " + scores.join(',') + ".");

            // add scores player did not get because they were skipped:
            var skipped_scores:string[] = []
            this.scoreGroups.forEach((sg:FinalScoreCalculationGroup) => {
                if(sg.playerScore > 0 && sg.playerScoreSkippedAsLower.length > 0) {

                    var skipped_titles = sg.playerScoreSkippedAsLower.map( (dx) => { return "'" + dx.title + "'" });
                    skipped_scores.push(
                        "Du fikk ikke poeng for "
                        + skipped_titles.join(',')
                        + " pga.  "
                        + sg.playerScoreTrigger.title
                        + ".");

                }
            });
            if(skipped_scores.length > 0)
                comments.push(skipped_scores.join(", "));

            // followup anwsers:
            this.followupQuestions.forEach( (question) => {
                var correct_answers = question.answers.filter( (a) => { return a.correct });
                var corret_answer_texts = correct_answers.map( (a) => { return "'" + a.text + "'" } );
                var question_text = question.question;
                if(question_text.length > 40)
                    question_text = question_text.substr(0, 40) + "..";

                comments.push("For spørsmålet '" + question_text + "' var riktig svar  " + corret_answer_texts.join(', '));
                comments.push(
                    "Du fikk "
                    + this.playerFollowupScore
                    + " av "
                    + this.maxFollowupScore
                    + " mulige poeng for oppfølgingsspørsmål");
            });

            // max score:
            comments.push("Maks poeng var " + this.maxScore + ".");

            // done!
            return comments;
        }

    }

}