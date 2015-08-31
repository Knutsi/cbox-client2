/**
 * Created by knut on 8/7/2015.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class TreatmentChoice {
        treatment:Treatment;
        modifierIndex = 0;

        constructor(rx:Treatment) {
            this.treatment = rx;
        }

        get displayName():string {
            return this.treatment.title;

        }

        get modifier():string {
            if(this.treatment.modifiers.length > 0)
                return this.treatment.modifiers[this.modifierIndex];
            else
                return null;
        }

        nextModifier() {
            this.modifierIndex += 1;
            if(this.modifierIndex >= this.treatment.modifiers.length)
                this.modifierIndex = 0;
        }
    }
}