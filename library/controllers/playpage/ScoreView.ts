/**
 * Created by knut on 8/8/2015.
 */

/// <reference path="../../cboxclient.ts" />


module cbox {

    export class ScoreView extends ElementController{

        static COMFORTS = [
            "Pas. komfortabel",
            "Lett ukomfortabel",
            "Moderat ukomfortabel",
            "Svært ukomfortabel",
            "Uutholdelig"];

        timeCell:HTMLDivElement;
        comfortCell:HTMLDivElement;
        riskCell:HTMLDivElement;
        costCell:HTMLDivElement;

        timerReference:any = null;
        timeDeltaMS = 0;

        constructor(root, pc) {
            super(root, pc)

            // set up the UI
            this.setupUI();

            // subscribe to events from the game:
            var controller = <PlayPageController>this.pageController;
            controller.game.onScoreUpdated.subscribe(() => { this.update(); })
            controller.game.onStateChange.subscribe((state) => {
                if(state.fromState == ClientState.READY && state.toState == ClientState.PLAYING_CASE) {
                    this.timeDeltaMS = 0;
                    this.update();
                }
            })
        }


        setupUI() {
            this.timeCell = this.player("time");
            this.comfortCell = this.player("comfort");
            this.riskCell = this.player("risk");
            this.costCell = this.player("cost");
        }


        update() {
            var score = (<PlayPageController>this.pageController).game.score;

            // reset timer:
            /*if(this.timerReference)
                clearInterval(this.timerReference);*/

            var comfort = Math.round(score.comfort)

            // start timer:
            this.timeDeltaMS = 0;
            if(!this.timerReference)
                this.timerReference = setInterval(() => { this.updateTime() }, 1000);

            // Update the cells:
            this.comfortCell.textContent = ScoreView.COMFORTS[comfort];
            this.riskCell.textContent = score.risk.toFixed(2).toString() + "% risiko";
            this.costCell.textContent = score.cost.toString() + ",- nok";

            // set risk cell class based on score:
            this.comfortCell.className = "comfort-level-" + comfort;
        }

        updateTime() {
            var controller = <PlayPageController>this.pageController;

            this.timeDeltaMS += 1000;
            var time_ms = controller.game.score.timeMS + this.timeDeltaMS;

            // calculate time spent:
            var t = time_ms/1000;
            var seconds = Math.floor(t % 60);
            t /= 60;
            var minutes = Math.floor(t % 60);
            t /= 60;
            var hours = Math.floor(t % 24);
            t /= 24;
            var days = Math.floor(t);

            var leading_0_seconds = "";
            if(seconds < 10)
                leading_0_seconds = "0";

            this.timeCell.textContent = days + ":" + hours + ":" + minutes + ":" + leading_0_seconds + seconds;
        }

    }

    MVC.registerElementController("ScoreView", ScoreView);
}