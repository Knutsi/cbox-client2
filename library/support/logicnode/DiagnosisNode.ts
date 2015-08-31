/**
 * Created by knut on 8/31/2015.
 */
/// <reference path="../../cboxclient.ts" />

module cbox {

    export class DiagnosisNode extends LogicNode {

        code:string;
        name:string;

        static fromObject(obj:{}):DiagnosisNode {
            var node = new DiagnosisNode();
            LogicNode.fromObjectInherited(obj, node);

            node.code = obj["Code"];
            node.name = obj["Name"];



            return node;
        }


        eval():boolean {

            var dx_objects = this.objects.filter( (obj) => { return  obj instanceof Diagnosis } )
            var matching = dx_objects.filter((dx:Diagnosis) => { return dx.code == this.code });

            return matching.length > 0;
        }

        get stringDescription():string {
            return this.name;
        }
    }


}