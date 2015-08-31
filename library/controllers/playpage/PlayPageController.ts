/**
 * Created by knut on 8/8/2015.
 */

/// <reference path="../../cboxclient.ts" />

module cbox {

    export class PlayPageController extends PageController {

        screenManager:ScreenManager = new ScreenManager();
        service:IServiceInterface;
        storage:StorageManager;
        game:GameClient;

        debugHash:string;

        constructor() {
            super();

            // error message banner:
            window.onerror = () => { (<HTMLElement>document.querySelector("#error_banner")).style.display = "block"; };

            // setup the game client:
            var serviceUrl = "../../service/";
            this.service = new FileServiceInterface(serviceUrl, 2);
            //this.service = new DummyServiceInterface();
            this.storage = new StorageManager(serviceUrl);
            this.game = new GameClient(this.service, this.storage);


        }


        run() {

            // the controller will respond to changes in the game client to show various screens
            // and subscribes to events:
            this.game.onStateChange.subscribe( ( args ) => {
                this.handleGameStateChange(args.toState);
            } )

            // setup events for buttons that control flow (buttons for elements are handled by controllers):
            this.element('startGameButton').onclick = () => { this.game.play() };
            this.element('gotoDnTButton').onclick = () => { this.screenManager.activate("dntscreen") };
            this.element('cancelDnTButton').onclick = () => {this.screenManager.activate("playscreen") };
            this.element('commitDnTButton').onclick = () => {this.game.commitDnT(); };
            this.element('commitFollowupButton').onclick = () => {this.game.commitFollowup(); };
            this.element('doneButton').onclick = () => {this.game.reset(true); };
            this.element('toEvalFormButton').onclick = () => { window.location.href = "http://goo.gl/forms/7yWlUyPQEc"; };

            this.element('actionSearchButton').onclick = () => { this.activateActionSearch("") };

            this.element('dxSearchField').onclick = () => { this.activateDiagnosisSearch() };
            this.element('rxSearchField').onclick = () => { this.activateTreatmentSearch() };


            // when a case view problem headline is clicked, we wish to respond:
            (<CaseView>MVC.ids["caseView"]).problemHeadlineClicked.subscribe((ev) => {
                this.activateProblemForm(ev.problem);
            });

            // when case is updated, scroll to top if on play screen:
            this.game.onCaseUpdated.subscribe(() => {
                if(this.screenManager.current.ident == "playscreen")
                    document.body.scrollIntoView(true);
            });

            // respond to hash changes:
            window.onhashchange = () => {
                this.screenManager.activate(document.location.hash.substr(1), false);
            };

            // handle key strokes:
            document.onkeyup = (event) => { this.handleKeystroke(event) };

            // initialize game client. From now on, this will control everything:
            this.game.initialize();
        }

        handleGameStateChange(state:string) {
            switch (state) {
                case ClientState.LOADING:
                    this.screenManager.activate("loadscreen");
                    break;

                case ClientState.READY:
                    this.screenManager.activate("readyscreen");
                    if(this.debugHash)
                        this.game.play();
                    break;

                case ClientState.PLAYING_CASE:
                    this.screenManager.activate("playscreen");
                    if(this.debugHash)
                        this.screenManager.activate(this.debugHash);

                    break;

                case ClientState.PLAYING_FOLLOWUP:
                    this.screenManager.activate("followupscreen");
                    break;

                case ClientState.SCORE_AND_COMMENT:
                    this.screenManager.activate("sncscreen");
                    break;

            }
        }


        activateActionSearch(str) {
            this.screenManager.activate("actionsearch");
            (<ActionSearchView>MVC.ids['actionsearchview']).focus();
            (<ActionSearchView>MVC.ids['actionsearchview']).startWith(str);
        }

        activateDiagnosisSearch() {
            this.screenManager.activate("dxsearch");
            (<DiagnosisSearchView>MVC.ids['dxsearchview']).focus();
        }

        activateTreatmentSearch() {
            this.screenManager.activate("rxsearch");
            (<DiagnosisSearchView>MVC.ids['rxsearchview']).focus();
        }

        activateForm(ident:string) {
            this.screenManager.activate("formscreen." + ident);
            (<FormView>MVC.ids["formview"]).formID = ident;
            document.body.scrollIntoView(true); // scroll to top in mobile espcailly
        }

        activateProblemForm(problem:Problem) {
            this.screenManager.activate("formscreen.problem." + problem.ident);
            (<FormView>MVC.ids["formview"]).problemID = problem.ident;
            document.body.scrollIntoView(true); // scroll to top in mobile espcailly
        }

        handleKeystroke(event:KeyboardEvent) {

            console.log(event);
            // if user presses escape, we go back to playscreen:
            //console.log(event.keyCode);
            //console.log(event.key);
            if(event.keyCode == 27) {
                this.screenManager.activate("playscreen");
                return;
            }

            // all other queries go to search:
            if(this.screenManager.current.ident == "playscreen") {
                var chr = String.fromCharCode(event.which);

                if(event.shiftKey) {
                    if(chr == "a" || chr == "A")
                        this.activateForm("2");

                    if(chr == "k" || chr == "K")
                        this.activateForm("8");

                    return;
                }

                this.activateActionSearch(chr);
            }
        }

    }
}