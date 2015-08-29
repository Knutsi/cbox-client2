/**
 * Created by knut on 8/28/2015.
 */

/// <reference path="../../cboxclient.ts" />

module cbox.logicnode {

    export class IsTreatment extends LogicNodeBase{

        ident:string;    // code of the treatment given
        name:string;    // display name, more or less
        modifier:string;

        constructor() {
            super();
            this.type = "IsTreatment";
        }

        get displayName():string {
            return this.name;
        }

        eval():boolean {
            var treatmentChoice = <TreatmentChoice>this.object;
            if(treatmentChoice.modifier == this.modifier
                && treatmentChoice.treatment.ident == this.ident) {
                return true;
            }

            return false;
        }

        static fromObject(obj:{}):IsTreatment {

            var node = new IsTreatment();
            node.ident = obj['Ident'];
            node.name = obj['Name'];
            node.modifier = obj['Modifier'];

            node.children = LogicNodeBase.instanceChildren(obj['Children']);

            return node;
        }
    }


}