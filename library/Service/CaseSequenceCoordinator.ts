/**
 * Created by knut on 9/5/2015.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class CaseSequenceCoordinator {

        static MODE_RANDOM = "RANDOM";
        static MODE_GRADUAL_ADD = "MODE_GRADUAL_ADD";
        static MODE_NEVER_SAME = "MODE_NEVER_SAME";
        static MODE_SPECIFIC_MODEL = "MODE_SPECIFIC_MODEL";
        static MODE_SPECIFIC_CASE = "MODE_SPECIFIC_CASE";

        manifest_:ExportManifesto;
        mode:string = CaseSequenceCoordinator.MODE_RANDOM;
        specificModel:string;
        specificCase:number;
        playCount:number = 0;

        playedModels:string[] = [];
        unplayedModels:string[] = [];

        playedCases:ExportManifestoEntry[] = [];
        unplayedCases:ExportManifestoEntry[] = [];


        get manifest():ExportManifesto {
            return this.manifest_;
        }

        set manifest(manifest:ExportManifesto) {
            this.manifest_ = manifest;

            // initially, all cases and models are unplayed:
            this.unplayedCases = manifest.entries.slice(0);
            this.unplayedModels = manifest.uniqueModels;

            console.log("CaseSequenceCoordinator got manifest - now ready")
        }


        playCase(entry:ExportManifestoEntry) {

            // move entry from unplayed to played list:
            var entry_index = this.unplayedCases.indexOf(entry);
            if(entry_index == -1)
                throw "CaseSeqeuenceCoordinator error - entry " + entry.id + "/" + entry.modelName + " played already";

            this.unplayedCases.splice(entry_index, 1);
            this.playedCases.push(entry);

            // reset played/unplayedd list if there are no more unplyed cases:
            if(this.unplayedCases.length <= 0) {
                this.unplayedCases = this.manifest.entries.slice(0);
                this.playedCases = [];

                if(this.unplayedCases.length <= 0)
                    throw "No unplyed cases after reset - no cases in manifesto?";
            }

            // we also play the model:
            this.playModel(entry.modelName);

            // tick:
            this.playCount += 1;
        }


        playModel(model_name:string) {

            // if it has not been played before, we remove if from unplayed:
            var unpl_index = this.unplayedModels.indexOf(model_name)
            if(unpl_index != -1) {

                if(this.playedModels.indexOf(model_name) != -1)
                    throw "Model is in unplayed model list, but also in played: " + model_name;

                this.unplayedModels.splice(unpl_index, 1);
                this.playedModels.push(model_name);
            }

        }


        get nextCaseID():number {
            switch(this.mode) {

                case CaseSequenceCoordinator.MODE_RANDOM:
                    return this.getNextCaseRandom();

                case CaseSequenceCoordinator.MODE_GRADUAL_ADD:
                    return this.getNextCaseGradualAdd();

                case CaseSequenceCoordinator.MODE_NEVER_SAME:
                    return this.getNextCaseOnlyNewDx();

                default:
                    throw "Unknown CaseSequenceCoordinator mode";
            }

        }


        getNextCaseRandom():number {

            // find a random entry:
            var entry_index = Math.round(Math.random() * (this.unplayedCases.length - 1));
            var entry = this.unplayedCases[entry_index];
            this.playCase(entry);

            return entry.id;
        }

        /**
         * If unplayed models exist, adds one to played, but */
        getNextCaseGradualAdd():number {

            // do we have any new models to hand out cases for?
            if(this.unplayedModels.length <= 0)
                return this.getNextCaseRandom();

            // if we are on the second case, we introduce a new dx so we have at least two:
            /*if(this.playCount == 1)
                return this.getNextCaseOnlyNewDx();*/

            // decide if we play a new case, or one from an already played model:
            var choice = Math.random();
            if(choice > 0.3)
            {
                return this.getNextCaseOnlyNewDx(); // yields case with a new dx
            }
            else
            {
                // get unplayed cases with models we have already played:
                var possible = this.unplayedCases.filter((c) => {
                    return this.playedModels.indexOf(c.modelName) == -1
                });

                var entry = Tools.randomEntry(possible);
                this.playCase(entry);
                return entry.id;

            }
        }

        getNextCaseOnlyNewDx():number {

            // once unplayed models are exhause, we use a random case instead:
            if(this.unplayedModels.length == 0)
                return this.getNextCaseRandom();

            // get a case that is in an unplayed model, and not played:
            var possible_cases = this.unplayedCases.filter( (e) => {
                return this.unplayedModels.indexOf( e.modelName ) != -1;
            });

            // pick random entry from possible cases:
            var entry:ExportManifestoEntry = Tools.randomEntry(possible_cases);

            // play case will also play model:
            this.playCase(entry);

            return entry.id;
        }



    }
}