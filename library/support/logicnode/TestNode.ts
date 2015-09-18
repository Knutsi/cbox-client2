/**
 * Created by knut on 8/31/2015.
 */
/// <reference path="../../cboxclient.ts" />

module cbox {

    export class TestNode extends LogicNode {

        key:string;
        title:string;


        static fromObject(obj:{}):TestNode {
            var node = new TestNode();
            LogicNode.fromObjectInherited(obj, node);

            node.key = obj["Key"];
            node.title = obj["Title"];

            return node;
        }


        eval():boolean {

            var ap_pair_objects = this.objects.filter( (obj) => { return  obj instanceof ActionProblemPair } )
            var matching = ap_pair_objects.filter((app:ActionProblemPair) => { return this.key in app.action.yields });

            /* FIXME - should this be on a problem-by-problem basis? Should problem go into test as a requirement? */

            return matching.length > 0;
        }

        get stringDescription():string {
            return "utført test \"" + this.title + "\"";
        }

    }


}