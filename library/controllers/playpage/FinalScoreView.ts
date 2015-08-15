/**
 * Created by knut on 8/8/2015.
 */

/// <reference path="../../cboxclient.ts" />


module cbox {

    export class FinalScoreView extends ElementController{

        scoreSpan:HTMLSpanElement;
        scoreCommentUl:HTMLUListElement;
        caseCommentUL:HTMLUListElement;

        game:GameClient;

        constructor(root, pc) {
            super(root, pc);

            // grab UI-elements:
            this.scoreSpan = this.player("score");
            this.scoreCommentUl = this.player("score-comment-list");
            this.caseCommentUL = this.player("case-comment-list");

            // connect to game and it's events:
            this.game = (<PlayPageController>this.pageController).game;
            this.game.onFinalScoreUpdated.subscribe(() => { this.update() })
        }


        update() {
            // set score:
            this.scoreSpan.textContent = this.game.finalScore.points.toString();

            // add score comments:
            var poplist = (list, ul) => {
                ul.innerHTML ="";
                list.forEach((comment) => {
                    var li = document.createElement("li");
                    li.textContent = comment
                    ul.appendChild(li);
                })
            }

            poplist(this.game.finalScore.calculationComments, this.scoreCommentUl);
            poplist(this.game.finalScore.caseComments, this.caseCommentUL);
        }


    }

    MVC.registerElementController("FinalScoreView", FinalScoreView);
}