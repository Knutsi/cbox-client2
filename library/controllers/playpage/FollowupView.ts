/**
 * Created by knut on 8/8/2015.
 */

/// <reference path="../../cboxclient.ts" />


module cbox {

    export class FollowupView extends ElementController{

        questionDiv:HTMLDivElement;

        constructor(root, pc) {
            super(root, pc);

            // get roleeplayers:
            this.questionDiv = this.player("questions");

            // render when questions arrive:
            var controller = <PlayPageController>this.pageController;
            controller.game.followupQuestions.onChange.subscribe(() => { this.update(); })
        }


        update() {
            var controller = <PlayPageController>this.pageController;
            this.questionDiv.innerHTML = "";
            this.render(controller);
        }


        render(controller:PlayPageController) {
            var questions = controller.game.followupQuestions;

            questions.forEach((question:FollowupQuestion, i) => {
                // questions:
                var p = document.createElement("p");
                p.textContent = question.question;
                this.questionDiv.appendChild(p);

                question.answers.forEach((answer, j) => {
                    var name = "Q" + i + "." + j;

                    var input = document.createElement("input");
                    input.setAttribute("type", "checkbox");
                    if(question.type == FollowupQuestion.TYPE_SINGLE_CHOICE)
                        input.setAttribute("type", "radio");

                    input.setAttribute("id", name);
                    input.setAttribute("name", "Q" + i);

                    var label = document.createElement("label");
                    label.setAttribute("for", name);
                    label.textContent = answer.text;

                    var br = document.createElement("br");

                    this.questionDiv.appendChild(input);
                    this.questionDiv.appendChild(label);
                    this.questionDiv.appendChild(br);

                    // control state dynamics:
                    input.onchange = () => {
                        if(input.checked) {
                            answer.chosen = true;
                        } else {
                            answer.chosen = false;
                        }
                    }
                });
            })
        }

    }

    MVC.registerElementController("FollowupView", FollowupView);
}