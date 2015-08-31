/**
 * Created by knut on 8/31/2015.
 */
/// <reference path="../../cboxclient.ts" />

module cbox {

    export class TreatmentNode extends LogicNode {

        ident:string;
        name:string;
        positiveOnAny:boolean = false;


        static fromObject(obj:{}):TreatmentNode {
            var node = new TreatmentNode();
            LogicNode.fromObjectInherited(obj, node);

            node.ident = obj["Ident"];
            node.name = obj["Name"];
            node.positiveOnAny = obj["PositiveOnAny"] == true.toString();

            return node;
        }

        eval():boolean {

            var rx_objects = this.objects.filter( (obj) => { return  obj instanceof TreatmentChoice } )
            var matching = rx_objects.filter((dx:TreatmentChoice) => { return dx.treatment.ident == this.ident });

            return matching.length > 0;
        }

        get stringDescription():string {
            return this.name;
        }
    }


}