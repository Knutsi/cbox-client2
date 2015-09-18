

/// <reference path="../../cboxclient.ts" />


module cbox {

    export class InitialSetupView extends ElementController{

        private neverSameRadio:HTMLInputElement;
        private gradualAddRadio:HTMLInputElement;
        private randomPickRadio:HTMLInputElement;
        private specificModelRadio:HTMLInputElement;
        private specificModelInput:HTMLInputElement;
        private startGameButton:HTMLDivElement;

        sequenceMode:string;

        onPlayClicked:Event<GenericEventArgs> = new Event<GenericEventArgs>();


        constructor(root, pc) {
            super(root, pc);
            var controller = <PlayPageController>this.pageController;

            this.neverSameRadio = this.player("radio-never-same");
            this.gradualAddRadio = this.player("radio-gradual-add");
            this.randomPickRadio = this.player("radio-pick-all");
            this.specificModelRadio = this.player("radio-specific-model");
            this.specificModelInput = this.player("specific-model-input");
            this.startGameButton = this.player("start-game-button");

            // are we in dev mode?  If not, we hide specific model:
            if(controller.devMode)
                this.specificModelRadio.style.display = "block";
            else
                this.specificModelRadio.style.display = "none";

            // are we in dev mode?  If not, we hide specific model:
            if(controller.devMode && LoadArguments.has("model"))
                this.specificModelInput.value = LoadArguments.get("model");

            // set default mode:
            this.sequenceMode = CaseSequenceCoordinator.MODE_GRADUAL_ADD;
            this.gradualAddRadio.checked = true;

            // events:
            this.neverSameRadio.onclick = () => { this.sequenceMode = CaseSequenceCoordinator.MODE_NEVER_SAME; };
            this.gradualAddRadio.onclick = () => { this.sequenceMode = CaseSequenceCoordinator.MODE_GRADUAL_ADD; };
            this.randomPickRadio.onclick = () => {this.sequenceMode = CaseSequenceCoordinator.MODE_RANDOM;};
            this.specificModelRadio.onclick = () => {this.sequenceMode = CaseSequenceCoordinator.MODE_SPECIFIC_MODEL;};

            this.startGameButton.onclick = () => { if(DCP.isReady("STARTGAME")) this.onPlayClicked.fire(new GenericEventArgs()); }
        }


        get specificModel():string {
            return this.specificModelInput.value;
        }


    }

    MVC.registerElementController("InitialSetupView", InitialSetupView);
}