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

        myTimeCell:HTMLTableCellElement;
        myCostCell:HTMLTableCellElement;
        myRiskCell:HTMLTableCellElement;
        myComfortCell:HTMLTableCellElement;

        meanTimeCell:HTMLTableCellElement;
        meanCostCell:HTMLTableCellElement;
        meanRiskCell:HTMLTableCellElement;
        //meanComfortCell:HTMLTableCellElement;

        meanCells:HTMLTableCellElement[];

        comparisonComment:HTMLSpanElement;

        game:GameClient;

        constructor(root, pc) {
            super(root, pc);

            // grab UI-elements:
            this.percentageSpan = this.player("percentage");
            this.scoreCommentUl = this.player("score-comment-list");
            this.caseCommentH2 = this.player("case-comment-headline");
            this.caseCommentUL = this.player("case-comment-list");

            this.myTimeCell = this.player("my-time");
            this.myCostCell = this.player("my-cost");
            this.myRiskCell = this.player("my-risk");
            //this.myComfortCell = this.player("my-comfort");

            this.meanTimeCell = this.player("mean-time");
            this.meanCostCell = this.player("mean-cost");
            this.meanRiskCell = this.player("mean-risk");
            //this.meanComfortCell = this.player("mean-comfort");

            this.meanCells = [this.meanTimeCell, this.meanCostCell, this.meanRiskCell];

            this.comparisonComment = this.player("comparison-message");

            // connect to game and it's events:
            this.game = (<PlayPageController>this.pageController).game;
            this.game.onFinalScoreUpdated.subscribe(() => { this.updateMain(); this.updateComparison(); })
        }


        updateMain() {
            // set score:
            var result = this.game.finalScore;
            this.percentageSpan.textContent = result.percentage.toString();

            // add score comments:
            var poplist = (list, ul) => {
                ul.innerHTML ="";
                list.forEach((comment) => {
                    var li = document.createElement("li");
                    li.textContent = comment;
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

        /**
         * Updates the comparison table.
         * */
        updateComparison() {
            // clear existing:
            this.comparisonComment.style.display = "block";
            this.comparisonComment.textContent = "Henter sammenligning..";
            this.meanCells.forEach((cell) => { cell.textContent = "--" });

            // fill our data:
            this.myTimeCell.textContent = Tools.millisecondsToTimeString(this.game.score.timeMS);
            this.myCostCell.textContent = this.game.score.cost.toString() + ",-";
            this.myRiskCell.textContent = this.game.score.risk.toString();

            // send request for comparison data:
            var controller = <PlayPageController>this.pageController;
            var service = <FileServiceInterface>controller.service;
            var url =  "/HowIsTheScore?name=" + encodeURIComponent(this.game.modelName);
            var req = new XMLHttpRequest();
            req.open("GET", url, true);
            req.onreadystatechange = () => {
                if(req.readyState == 4) {

                    if(req.status != 200) {
                        this.comparisonComment.textContent = "Kunne ikke hente sammenligningsdata. Teknisk feil.";
                    } else {
                        try
                        {
                            var data = JSON.parse(req.responseText);
                            if(data['Status'] == "OK") {

                                this.handleComparisonDataRecieved(
                                    data["TimeMean"],
                                    data["CostMean"],
                                    data["RiskMean"]
                                );
                                this.comparisonComment.style.display = "none";

                            } else if(data['Status'] == "INSUFFICIENT") {

                                this.comparisonComment.textContent = "Utilstrekkelig datamengde innsamlet til å danne en sammenligning";
                            }
                        } catch (err) {
                            console.log("Error: exception on comparison data loading");
                            console.log(err);
                            this.comparisonComment.textContent = "Sammenligning kunne desverre ikke hentes.";
                        }
                    }
                }
            };

            req.send();
        }

        handleComparisonDataRecieved(time_ms:number, cost:number, risk:number) {

            this.comparisonComment.style.display = "none";

            this.meanTimeCell.textContent = Tools.millisecondsToTimeString(time_ms);
            this.meanCostCell.textContent = cost.toString() + ",-";
            this.meanRiskCell.textContent = risk.toString() ;
            //this.meanComfortCell.textContent = comfort.toString();

            if(this.game.score.timeMS < time_ms)
                this.myTimeCell.className = "green_fore";
            else
                this.myTimeCell.className = "red_fore";
        }

    }

    MVC.registerElementController("FinalScoreView", FinalScoreView);
}