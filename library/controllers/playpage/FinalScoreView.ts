/**
 * Created by knut on 8/8/2015.
 */

/// <reference path="../../cboxclient.ts" />


module cbox {

    export class FinalScoreView extends ElementController{

        percentageSpan:HTMLSpanElement;
        scoreCommentUl:HTMLUListElement;
        caseCommentH2:HTMLHeadingElement;
        caseCommentUL:HTMLUListElement;

        game:GameClient;

        constructor(root, pc) {
            super(root, pc);

            // grab UI-elements:
            this.percentageSpan = this.player("percentage");
            this.scoreCommentUl = this.player("score-comment-list");
            this.caseCommentH2 = this.player("case-comment-headline");
            this.caseCommentUL = this.player("case-comment-list");

            // connect to game and it's events:
            this.game = (<PlayPageController>this.pageController).game;
            this.game.onFinalScoreUpdated.subscribe(() => { this.update() })
        }


        update() {
            // set score:
            var result = this.game.finalScore;
            this.percentageSpan.textContent = result.percentage.toString();

            // add score comments:
            var poplist = (list, ul) => {
                ul.innerHTML ="";
                list.forEach((comment) => {
                    var li = document.createElement("li");
                    li.textContent = comment
                    ul.appendChild(li);
                })
            }

            var explanation:string[] = [];
            explanation.push("Du fikk " + result.score + " av maksimalt " + result.maxScore);
            explanation.push("Poengberegning for denne kasuistikken:");
            //explanation = explanation.concat(result.scoreExplanation);

            poplist(explanation, this.scoreCommentUl);
            var ul = document.createElement("ul");
            this.scoreCommentUl.appendChild(ul);
            poplist(result.scoreExplanation, ul);


            poplist(this.game.finalScore.comments, this.caseCommentUL);

            // hide comments headline if not needed:
            if(this.game.finalScore.comments.length <= 0)
                this.caseCommentH2.style.display = "none";
            else
                this.caseCommentH2.style.display = "block";
        }


    }

    MVC.registerElementController("FinalScoreView", FinalScoreView);
}