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
            this.element('doneButton').onclick = () => {this.game.reset(); };

            this.element('actionSearchButton').onclick = () => { this.activateActionSearch() };

            this.element('dxSearchField').onclick = () => { this.activateDiagnosisSearch() };
            this.element('rxSearchField').onclick = () => { this.activateTreatmentSearch() };


            // when case is updated, scroll to top if on play screen:
            this.game.onCaseUpdated.subscribe(() => {
                if(this.screenManager.current.ident == "playscreen")
                    document.body.scrollIntoView(true);
            })

            // respond to hash changes:
            window.onhashchange = () => {
                this.screenManager.activate(document.location.hash.substr(1), false);
            };

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


        activateActionSearch() {
            this.screenManager.activate("actionsearch");
            (<ActionSearchView>MVC.ids['actionsearchview']).focus();
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
    }
}