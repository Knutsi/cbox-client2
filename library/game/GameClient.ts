/**
 * Created by knut on 8/5/2015.
 */

/// <reference path="../cboxclient.ts" />


module cbox {

    /***
     * The game client handles interaction with the server through a service interface and a storage manager.
     * It keeps track of the game's state at any given point, and is the core class that makes the game
     * operate.
     *
     * It has fields that reflect game state, such as pendingActions and case_.
     *
     * For the current status of the game, it extends StateMachine. Interested objects can subscribe to
     * changes in state, and react to those.  This includes the PageController and various elements on
     * the client page that needs to update as the game progresses.
     *
     * Events are provided for updates on changes to internal fields, such as the case.  The lists, such as
     * pendingActions, are of type BindingList which have events that fire on changes.
     * */
    export class GameClient extends StateMachine {

        service:IServiceInterface;
        storage:StorageManager;

        // internal fields:
        pendingActions:BindingList<ActionProblemPair> = new BindingList<ActionProblemPair>();
        pendingDiagnosis:BindingList<Diagnosis> = new BindingList<Diagnosis>();
        pendingTreatments:BindingList<TreatmentChoice> = new BindingList<TreatmentChoice>();

        case_:Case;
        assets:BindingList<Asset> = new BindingList<Asset>();
        score:Scorecard;
        followupQuestions:BindingList<FollowupQuestion> = new BindingList<FollowupQuestion>();

        // events:
        onCaseUpdated:Event<GenericEventArgs> = new Event<GenericEventArgs>();
        onScoreUpdated:Event<GenericEventArgs> = new Event<GenericEventArgs>();

        constructor(service:IServiceInterface, storage:StorageManager) {
            super();    // constructor for state machine

            // the service and storage manager we will be using
            this.service = service;
            this.storage = storage;

            // setup state machine states:
            this.setupStates();

            console.log("GameClient created");
        }

        /**
         * Registers the states the game cycles through, and what states the client can transform into
         * from any given state.  This defines the basic flow of the game, and the components on the
         * page and the page controller will react to these state changes to determine what is to be
         * shown.
         * */
        setupStates() {
            this.registerState(ClientState.UNINITILIAZED, [ClientState.LOADING]);
            this.registerState(ClientState.LOADING, [ClientState.READY]);
            this.registerState(ClientState.READY, [ClientState.AWAIT_PLAYING_CASE]);

            this.registerState(ClientState.AWAIT_PLAYING_CASE, [ClientState.PLAYING_CASE]);
            this.registerState(ClientState.PLAYING_CASE, [ClientState.AWAIT_PLAYING_FOLLOWUP]);

            this.registerState(ClientState.AWAIT_PLAYING_FOLLOWUP, [
                ClientState.PLAYING_FOLLOWUP,
                ClientState.AWAIT_SCORE_AND_COMMENT]);
            this.registerState(ClientState.PLAYING_FOLLOWUP, [ClientState.AWAIT_SCORE_AND_COMMENT]);

            this.registerState(ClientState.AWAIT_SCORE_AND_COMMENT, [ClientState.SCORE_AND_COMMENT]);
            this.registerState(ClientState.SCORE_AND_COMMENT, [ClientState.READY]);

            this.init(ClientState.UNINITILIAZED);
        }

        /***
         * Starts the game client.  Will load data as needed, then put game in ready mode.
         */
        initialize() {
            this.go(ClientState.LOADING);

            this.storage.load( (status) => {
                // check that load was ok, then notify we are ready:
                if(status.ok) {
                    this.go(ClientState.READY);
                } else {
                    alert("Loading resources failed");
                    this.go(ClientState.ERROR);
                }
            });
        }


        /***
         * From the ready state, this will trigger a case loading.  Once loading is done, the
         * state will change to PLAYING_CASE and the game is on.
         * */
        play(specs:any = null) {
            this.go(ClientState.AWAIT_PLAYING_CASE);

            // reset internal fields and game states:
            this.case_ = new Case();
            this.score = new Scorecard();
            this.assets.clear();

            this.pendingActions.clear();
            this.pendingDiagnosis.clear();
            this.pendingTreatments.clear();
            this.followupQuestions.clear();

            // user interface to request case and start game:
            this.service.startGame(specs, (status, case_) => {
                if(status.ok) {
                    this.case_ = case_;
                    this.go(ClientState.PLAYING_CASE);

                    this.onCaseUpdated.fire(new GenericEventArgs());
                    this.onScoreUpdated.fire(new GenericEventArgs());

                } else {
                    alert("startGame on service failed");
                    this.go(ClientState.ERROR);
                }
            });
        }


        /**
         * Commits actions to service.  The if results return ok, the game updates it's case,
         * assets and score.
         * */
        commitActions() {

            // send pending actions to interface:
            this.service.commitActions(this.pendingActions, (status, results, assets, score) => {

                if(status.ok) {
                    // update internal fields to current status:
                    this.case_.extend(results);
                    this.assets.add(assets);
                    this.score = score;

                    this.onCaseUpdated.fire(new GenericEventArgs());
                    this.onScoreUpdated.fire(new GenericEventArgs());

                } else {
                    alert("Committing actions failed");
                    this.go(ClientState.ERROR);
                }

            });

            // clear pending actions:
            this.pendingActions.clear();
        }


        /**
         * Commits the diagnose and treatment, awaits followupQuestions.
         * */
        commitDnT() {
            this.go(ClientState.AWAIT_PLAYING_FOLLOWUP);

            // send diagnosis and treatments to service:
            this.service.commitDnT(this.pendingDiagnosis.items, this.pendingTreatments.items, (status, questions) => {

                if(status.ok) {
                    // if we have quiz, we move to follow-up, if not, we go straight to score:
                    this.go(ClientState.PLAYING_FOLLOWUP);
                    if(questions) {
                        this.followupQuestions.add(questions);
                    } else {
                        this.commitFollowup();
                    }
                } else {
                    alert("Committing diagnosis and treatment failed");
                    this.go(ClientState.ERROR);
                }
            })
        }

        /**
         * Commits the followupQuestions answers, awaits score and comment.
         * */
        commitFollowup() {
            this.go(ClientState.AWAIT_SCORE_AND_COMMENT);

            // send followupQuestions answers to service:
            this.service.commitFollowup(this.followupQuestions.items, (status, score, comments) => {

                if(status.ok) {
                    this.go(ClientState.SCORE_AND_COMMENT);
                } else {
                    alert("Commiting followupQuestions/retriving score failed");
                    this.go(ClientState.ERROR);
                }

            })

        }

        reset() {
            this.go(ClientState.READY);
        }


        private getPending(action_ident:string, problem_ident:string) {
            for(var i in this.pendingActions.items) {
                var ap = this.pendingActions.items[i];

                if(ap.action.ident == action_ident && ap.problem.ident == problem_ident)
                    return ap;
            }

            return null;

        }


        hasPending(ap_pair:ActionProblemPair):boolean {

            if(this.getPending(ap_pair.action.ident, ap_pair.problem.ident))
                return true;
            else
                return false;
        }


        togglePending(ap_pair:ActionProblemPair) {

            var pending = this.getPending(ap_pair.action.ident, ap_pair.problem.ident);
            if(!pending)
                this.pendingActions.add([ap_pair]);
            else
                this.pendingActions.remove([pending]);
        }


        hasPendingDx(dx:Diagnosis) {
            return this.pendingDiagnosis.items.indexOf(dx) != -1;
        }


        togglePendingDx(dx:Diagnosis) {
            if(this.hasPendingDx(dx))
                this.pendingDiagnosis.remove([dx]);
            else
                this.pendingDiagnosis.add([dx])

        }

    }

}