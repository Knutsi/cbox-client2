/**
 * Created by knut on 8/8/2015.
 */

/// <reference path="../../cboxclient.ts" />

module cbox {

    export class PlayPageController extends PageController {

        screenManager:ScreenManager = new ScreenManager();
        service:DummyServiceInterface;
        storage:StorageManager;
        game:GameClient;

        constructor() {
            super();

            // setup the game client:
            var serviceUrl = "../../testservice/";
            this.service = new DummyServiceInterface();
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
            this.element('cancelFormButton').onclick = () => {this.screenManager.activate("playscreen") };
            this.element('commitDnTButton').onclick = () => {this.game.commitDnT(); };
            this.element('commitFollowupButton').onclick = () => {this.game.commitFollowup(); };
            this.element('doneButton').onclick = () => {this.game.reset(); };



            this.element('actionSearchButton').onclick = () => { this.activateActionSearch() };
            this.element('cancelActionSearchButton').onclick = () => { this.screenManager.activate("playscreen") };


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
                    break;

                case ClientState.PLAYING_CASE:
                    this.screenManager.activate("playscreen");
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
            this.screenManager.activate("searchscreen");
        }

        activateTreatmentSearch() {
            this.screenManager.activate("searchscreen");
        }

        activateForm(ident:string) {
            this.screenManager.activate("formscreen." + ident);
            (<FormView>MVC.ids["formview"]).formID = ident;
        }
    }
}