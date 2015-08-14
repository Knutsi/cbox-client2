/**
 * Created by knut on 8/8/2015.
 */

/// <reference path="../../cboxclient.ts" />


module cbox {

    /*
     For general text presentation "textbook style" rendering get a challenge because values need
     to have context to make sense.  We will use the following structure:

        * Problem (title displayed if not root)
            * Primary group (history, clinical, lab, study)  (not shown)
                * Headline (human logic; print if headline specifies so)
                    * Yielding action (print title if action specifies so)
                        * Individual value (prefix + unit if action specifies so)

     Example:

     * "Ustix"-action prints title, so does individual values
     * "Hormoner"-headline does not print
     * "Sosialt"-headline prints
     * "Pulm"/"Cor"-headlines etc. prints.
     * "history.cough.duration" does not print prefix but is found in printing headline "Pulm"
     * "lab.vblood.crp" prints prefix "CRP"
     */

    export class CaseView extends ElementController{

        titleH1:HTMLHeadingElement;
        caseDiv:HTMLDivElement;

        static primaryGrouping = ["history.", "clinical.", "lab.", "study."];

        constructor(root, pc) {
            super(root, pc);

            // grab elements:
            this.titleH1 = this.player("title");
            this.caseDiv = this.player("case");

            // connect events:
            var controller = <PlayPageController>this.pageController;
            controller.game.onCaseUpdated.subscribe(() => { this.update() });
        }


        /**
         * Updates the display by rendering relevant information
         * */
        update() {
            // aquire basic variables:
            var controller = <PlayPageController>this.pageController;
            var case_ = controller.game.case_;

            // clear old content:
            this.caseDiv.innerHTML = "";

            // render components:
            this.renderTitle(case_);
            case_.problems.forEach( (problem) => {
                this.renderProblem(problem, case_, controller);
            });

            // highlight latest added spans if not 0:
            if(case_.version != 0) {
                var highlights = this.root.querySelectorAll("[data-cbox-commit-nr=\"" + case_.version +"\"]");
                for(var i in highlights)
                    (<HTMLSpanElement>highlights.item(i)).classList.add("flash_highlight");
            }
        }


        /**
         * Renders the title into the heading.
         * */
        renderTitle(case_:Case) {
            /* title data should ways be included in a case, meaning age, gender and presenting complaint is
            * always present */
            this.titleH1.innerText = RenderHelper.toStringOnlyCommas([
                case_.rootProblem.get(Case.GENDER_KEY),
                case_.rootProblem.get(Case.AGE_KEY),
                case_.rootProblem.get(Case.PRESENTING_COMPLAINT_KEY)]);
        }

        /**
         * Renders a problem into the case div.  If it's the case t
         * **/
        renderProblem(problem:Problem, case_:Case, controller:PlayPageController){

            var div = document.createElement("div");

            // if we are *not* root, we add title:
            if(!problem.isRoot) {
                var title_span = document.createElement("span");
                title_span.className = "problem_title";
                title_span.innerText = problem.title;
                div.appendChild(title_span);
            }

            // at this level, we render the problem's value first grouped by key,
            // then by headline, and then by action:
            CaseView.primaryGrouping.forEach( (prefix) => {

                // for root problem, use a new paragraph for each primary group
                // others are rendered straight into the problem div:
                var root:HTMLElement = div;
                if(problem.isRoot) {
                    root = document.createElement("p");
                    div.appendChild(root);
                }

                this.renderPrimaryGroup(prefix, problem, root, controller);

            });

            this.caseDiv.appendChild(div);
        }

        /**
         * The primary group is a collection of results with a given prefix.  Inside the primary group the
         * results are sorted by the headline the triggering action belongs to.
         * ***/
        renderPrimaryGroup(prefix:string, problem:Problem, root:HTMLElement, controller:PlayPageController) {
            // find results in problem that starts with given prefix:
            var results = problem.results.filter( (r) => {
                return r.key.indexOf(prefix) == 0
                    && r.key != Case.GENDER_KEY
                    && r.key != Case.PRESENTING_COMPLAINT_KEY
                    && r.key != Case.AGE_KEY;
            } )

            // work through all the headlines and their actions, render results as indicated:
            controller.storage.headlines.forEach( (headline) => {

                // add value if it is a yield of the current action, and also pop it from the current results:
                headline.actions.forEach((action) => {

                    var results_rendered = [];
                    var action_span = document.createElement("span");

                    // render each result with a key yielded by this action into the span:
                    action.yields.forEach( (yield_key) => {

                        for(var i in results) {
                            var result:TestResult = results[i];
                            if(result.key == yield_key) {
                                results_rendered.push(result);
                                // render:
                                this.renderResult(action_span, result);
                                break;
                            }
                        }

                    });

                    // if there are results rendered, we add to root and remove from results to render:
                    if(results_rendered.length > 0) {
                        root.appendChild(action_span);
                        results_rendered.forEach((r) => { results.splice(results.indexOf(r), 1); })
                    }

                });

            });

        }


        renderResult(parent_span:HTMLSpanElement, result:TestResult) {
            var span = document.createElement("span");
            span.innerText = result.displayString;
            span.setAttribute("data-cbox-commit-nr", result.committedInVersion.toString());
            parent_span.appendChild(span);
            parent_span.appendChild(document.createTextNode(" "));
        }

    }


    MVC.registerElementController("CaseView", CaseView);
}