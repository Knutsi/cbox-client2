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

        problemHeadlineClicked:Event<ProblemHeadlineClickedEventArgs> = new Event<ProblemHeadlineClickedEventArgs>();

        static primaryGrouping = ["history.", "clinical.", "lab.", "micbio.", "study."];
        static primaryGroupHeading = {
            "history." : "Anamnese",
            "clinical." : "Klinisk undersøkelse",
            "lab." : "Lab",
            "micbio." : "Mikrobiologi",
            "study." : "Raiologi, skopi",
        };

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


            // render problems split by primary groups:
            CaseView.primaryGrouping.forEach( (prefix) => {
                var head = document.createElement("h2");
                head.textContent = CaseView.primaryGroupHeading[prefix];
                var p = document.createElement("p");
                p.setAttribute("data-primary-group", prefix);   // just for kicks

                case_.problems.forEach( (problem) => {
                    this.renderProblem(prefix, p, problem, case_, controller);
                    p.appendChild(document.createTextNode(" "));   // extra space
                });

                if(p.innerHTML.trim() != "")
                    this.caseDiv.appendChild(head);
                this.caseDiv.appendChild(p);
            });

            // highlight latest added spans if not 0:
            if(case_.version != 0) {
                var highlights = this.root.querySelectorAll("[data-cbox-commit-nr=\"" + case_.version +"\"]");
                if(highlights.length > 0)
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
            var age = case_.rootProblem.get(Case.AGE_KEY).values[0];
            var gender = case_.rootProblem.get(Case.GENDER_KEY).displayStringHTML;
            var complaint = case_.rootProblem.get(Case.PRESENTING_COMPLAINT_KEY).displayStringHTML.toLowerCase();

            // adjust gender name:
            var gender_desc = "Kvinne";
            if(parseInt(age) < 19) {
                if(gender == "F") gender_desc = "Jente";
                if(gender == "M") gender_desc = "Gutt";
            } else if(gender == "M")
                gender_desc = "Mann"

            /*this.titleH1.innerText = RenderHelper.toStringOnlyCommas([
                case_.rootProblem.get(Case.GENDER_KEY),
                case_.rootProblem.get(Case.AGE_KEY),
                case_.rootProblem.get(Case.PRESENTING_COMPLAINT_KEY)]);*/

            this.titleH1.innerText = gender_desc + ", " + age + ", " + complaint;
        }

        /**
         * Renders a problem into the case div.  If it's the case t
         * **/
        renderProblem(
            prefix:string,
            p:HTMLParagraphElement,
            problem:Problem,
            case_:Case,
            controller:PlayPageController)
        {

            //var div = document.createElement("div");


            // find relevant results for this primary group:
            var results = problem.results.filter( (r) => {
                return r.key.indexOf(prefix) == 0
                    && r.key != Case.GENDER_KEY
                    && r.key != Case.PRESENTING_COMPLAINT_KEY
                    && r.key != Case.AGE_KEY;
            } );

            // if we are *not* root, we add title:
            if(!problem.isRoot && results.length > 0) {
                var title_span = document.createElement("span");
                title_span.className = "problem_title";
                title_span.innerText = case_.getProblemTextReference(problem) + " " + problem.title + ": ";
                title_span.onclick = () =>
                {
                    this.problemHeadlineClicked.fire(new ProblemHeadlineClickedEventArgs(problem));
                };
                p.appendChild(title_span);
            }

            // at this level, we render the problem's value first grouped by key,
            // then by headline, and then by action:

            // for root problem, use a new paragraph for each primary group
            // others are rendered straight into the problem div:
            /*var root:HTMLElement = div;
            if(problem.isRoot) {
                root = document.createElement("p");
                div.appendChild(root);
            }*/

            this.renderPrimaryGroup(results, problem, p, controller);
        }

        /**
         * The primary group is a collection of results with a given prefix.  Inside the primary group the
         * results are sorted by the headline the triggering action belongs to.
         * ***/
        renderPrimaryGroup(results:TestResult[], problem:Problem, root:HTMLElement, controller:PlayPageController) {
            // find results in problem that starts with given prefix:


            // work through all the headlines and their actions, render results as indicated:
            controller.storage.headlines.forEach( (headline) => {

                // add value if it is a yield of the current action, and also pop it from the current results:
                headline.actions.forEach((action) => {

                    var results_rendered = [];
                    var action_span = document.createElement("span");

                    // add action headline:
                    if(action.headlineVisibleHint) {
                        var action_title_span = document.createElement("span");
                        action_title_span.className = "action_title_span";
                        action_title_span.textContent = action.title + ": ";
                        action_span.appendChild(action_title_span);
                    }

                    // render each result with a key yielded by this action into the span:
                    var yields = action.yields.concat([]);  // clone yields
                    Tools.shuffle(yields);   // randomize order
                    yields.forEach( (yield_key) => {

                        for(var i in results) {
                            var result:TestResult = results[i];
                            if(result.key == yield_key && this.shouldRender(result)) {
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

            // get test info:

            // render result:
            var span = document.createElement("span");
            span.innerHTML = result.displayStringHTML;
            span.setAttribute("data-cbox-commit-nr", result.committedInVersion.toString());
            parent_span.appendChild(span);
            parent_span.appendChild(document.createTextNode(" "));
        }


        /***
         * Checks if the result should be rendered or not.  This is to enable parent-child based rules.
         * Basically, (1) for a parent, if one or more of the children are abnormal, we should not render.
         * (2) for a parent with no abnormal children, we render
         * (3) children render if siblings exists that are abnormal
         * @param result
         */
        private shouldRender(result:TestResult) {
            if(result.displayStringHTML.trim() == "(NULL)")
                return false;

            if(!result.hasChildren && !result.parentResult)
                return true;

            if(result.parentResult != null && !result.hasAbnormalSiblings)
                return false;

            if(result.hasAbnormalChildren)
                return false;

            if(result.abnormal || result.hasAbnormalSiblings)
                return true;

            if(!result.hasAbnormalChildren)
                return true;

            return false;
        }

        /*private shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }*/

    }

    export class ProblemHeadlineClickedEventArgs {
        problem:Problem;

        constructor(problem:Problem) {
            this.problem = problem;
        }
    }


    MVC.registerElementController("CaseView", CaseView);
}