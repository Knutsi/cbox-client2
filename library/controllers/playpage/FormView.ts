/// <reference path="../../cboxclient.ts" />

module cbox {

    export class FormView extends ElementController{

        private form:Form = null;
        private problem:Problem = null;
        title:HTMLHeadingElement;
        contentRoot:HTMLDivElement;

        constructor(root, pc) {
            super(root, pc);

            this.title = <HTMLHeadingElement>this.player("title");
            this.contentRoot = <HTMLDivElement>this.player("content");
        }


        get formID() {
            return this.form.ident;
        }


        set formID(value) {
            console.log("Form switching to: " + value);

            this.form = null;
            this.problem = null;

            var controller =  <PlayPageController>this.pageController;
            if(!controller.storage.forms)
                return;

            for(var i in controller.storage.forms)
                if(controller.storage.forms[i].ident == value)
                    this.form = controller.storage.forms[i];


            if(this.form)
                this.update();
        }

        get problemID() {
            return this.problem.ident;
        }

        set problemID(ident:string) {
            this.form = null;

            // get problem:
            var controller =  <PlayPageController>this.pageController;
            this.problem = controller.game.case_.getProblem(ident);

            if(this.problem)
                this.update();
        }


        update() {
            // if rendering form:
            if(this.form != null) {
                this.title.textContent = this.form.title;

                // render headlines:
                this.contentRoot.innerHTML = "";

                this.form.headlines.forEach((headline) => {
                    this.renderHeadline(headline);
                })
            }

            // render problem selection:
            else if(this.problem != null) {
                this.title.textContent = "Mulige handlinger for \"" + this.problem.title + "\"";
                this.contentRoot.innerHTML = "";
                this.renderProblemActions();
            } else {
                throw "Rendering form with no form or problem set!";
            }

        }


        renderHeadline(headline:Headline) {
            var div = document.createElement("div");
            var h2 = document.createElement("h2");

            div.className = "contentblock";
            div.appendChild(h2);

            this.contentRoot.appendChild(div);

            h2.textContent = headline.title;

            // get actions that can be applied to the case from this headline:

            headline.actions.forEach( (action) => {
                var action_count = this.renderAction(div, action);
            })

        }


        renderAction(parent_div:HTMLDivElement, action:Action):number {
            var count = 0;
            var controller = <PlayPageController>this.pageController;
            var game = (<PlayPageController>this.pageController).game;
            var problems = game.case_.problems;

            problems.forEach( (problem) => {
                if(action.appliesTo(problem))  {
                    count++;

                    this.renderChoice(action, problem, parent_div, game, controller, true);
                }
            })


            return count;
        }


        renderChoice(
            action:Action,
            problem:Problem,
            parent_div:HTMLDivElement,
            game:GameClient,
            controller:PlayPageController,
            render_problem_title:boolean)
        {
            var ap_pair = new ActionProblemPair(action, problem);

            // check if this ap-pair has already been played:
            var matched_pairs = game.commitedActions.items.filter(
                (app) =>
                {  return app.action.ident == action.ident && app.problem.ident == problem.ident; }
            );

            // create elements:
            var div = document.createElement("div");
            var checkbox = document.createElement("input");

            var text = document.createTextNode(action.title);
            if(render_problem_title)
                text = document.createTextNode(ap_pair.displayName);


            div.className = "clickable";
            if(matched_pairs.length > 0)
                div.className = "clickable strikethrough";
            checkbox.setAttribute("type", "checkbox");
            checkbox.checked = game.hasPending(ap_pair);

            parent_div.appendChild(div);
            div.appendChild(checkbox);
            div.appendChild(text);

            // create and assign events:
            var select = (ev) => {
                game.togglePending(ap_pair);
                checkbox.checked = game.hasPending(ap_pair);
                ev.stopPropagation();

                controller.screenManager.signalDataChanged();
            };

            //checkbox.onchange = select;
            div.onclick = select;
        }


        renderProblemActions() {
            var controller = <PlayPageController>this.pageController;
            var game = (<PlayPageController>this.pageController).game;

            // we want to provide some context for our options, so we group them by form:
            controller.storage.forms.forEach( (form) => {

                var choices_count = 0;
                var div = document.createElement("div");
                div.className = "contentblock";
                var h2 = document.createElement("h2");
                h2.textContent = form.title;
                div.appendChild(h2);

                form.headlines.forEach((headline) => {

                    headline.actions.forEach( (action) => {
                        if(action.appliesTo(this.problem)) {
                            this.renderChoice(action, this.problem, div, game, controller, false);
                            choices_count++;
                        }
                    });
                });

                if(choices_count > 0)
                    this.contentRoot.appendChild(div);

            });
        }

    }

    MVC.registerElementController("FormView", FormView);
}