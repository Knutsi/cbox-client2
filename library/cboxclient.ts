/**
 * Created by knutsi on 24/07/15.
 */

/* THIS HAS TO GO FIRST - OTHERS DEPEND ON IT*/
/// <reference path="support/MVCController.ts" />

/// <reference path="support/RenderHelper.ts" />


/* Support classes*/
/// <reference path="support/AsyncRequestResult.ts" />
/// <reference path="support/BindingList.ts" />
/// <reference path="support/Event.ts" />
/// <reference path="support/StateMachine.ts" />
/// <reference path="support/Template.ts" />
/// <reference path="support/ScreenManager.ts" />
/// <reference path="support/ScreenDataFlag.ts" />
/// <reference path="support/ReactiveElementController.ts" />
/// <reference path="support/StorageManager.ts" />
/// <reference path="support/PageController.ts" />
/// <reference path="support/ElementController.ts" />
/// <reference path="support/LoadTask.ts" />


/// <reference path="game/Action.ts" />
/// <reference path="game/Class.ts" />
/// <reference path="game/Form.ts" />
/// <reference path="game/Headline.ts" />
/// <reference path="game/Diagnosis.ts" />
/// <reference path="game/Treatment.ts" />


/* service layer implementation */
/// <reference path="service/IServiceInterface.ts" />
/// <reference path="service/DummyServiceInterface.ts" />
/// <reference path="service/FileServiceInterface.ts" />


/* Game layer implemntation */
/// <reference path="game/ClientState.ts" />
/// <reference path="game/GameClient.ts" />
/// <reference path="game/ActionProblemPair.ts" />
/// <reference path="game/Action.ts" />
/// <reference path="game/Case.ts" />
/// <reference path="game/Problem.ts" />
/// <reference path="game/Asset.ts" />
/// <reference path="game/AssetCollection.ts" />
/// <reference path="game/TestResult.ts" />
/// <reference path="game/Scorecard.ts" />
/// <reference path="game/TreatmentChoice.ts" />
/// <reference path="game/DiagnosisChoice.ts" />
/// <reference path="game/FollowupQuestion.ts" />
/// <reference path="game/FinalScore.ts" />

/* Element Controllers */
/// <reference path="controllers/playpage/PlayPageController.ts" />
/// <reference path="controllers/playpage/ReactiveBackButton.ts" />
/// <reference path="controllers/playpage/ScreenView.ts" />
/// <reference path="controllers/playpage/SearchView.ts" />
/// <reference path="controllers/playpage/ScoreView.ts" />
/// <reference path="controllers/playpage/CaseView.ts" />
/// <reference path="controllers/playpage/TodoView.ts" />
/// <reference path="controllers/playpage/ActionView.ts" />
/// <reference path="controllers/playpage/FollowupView.ts" />
/// <reference path="controllers/playpage/FinalScoreView.ts" />
/// <reference path="controllers/playpage/CommentView.ts" />
/// <reference path="controllers/playpage/TreatmentPickerView.ts" />
/// <reference path="controllers/playpage/DiagnosisPickerView.ts" />
/// <reference path="controllers/playpage/ActionSearchView.ts" />
/// <reference path="controllers/playpage/DiagnosisSearchView.ts" />
/// <reference path="controllers/playpage/TreatmentSearchView.ts" />


/// <reference path="controllers/playpage/FormView.ts" />




console.log("Cbox client library loaded");