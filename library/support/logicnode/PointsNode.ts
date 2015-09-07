/**
 * Created by knut on 8/31/2015.
 */
/// <reference path="../../cboxclient.ts" />

module cbox {

    export class PointsNode extends LogicNode {

        points = 0;
        matchedComment:string = "";
        unmatchedComment:string = "";

        static fromObject(obj:{}):PointsNode {
            var node = new PointsNode();
            LogicNode.fromObjectInherited(obj, node);

            node.points = parseInt(obj["Points"]);
            node.matchedComment = obj["MatchedComment"];
            node.unmatchedComment = obj["UnmatchedComment"];

            return node;
        }

        get stringDescription():string {
            var child_descs_inidiv = this.children.map((c) => { return c.stringDescription });
            var child_descs = child_descs_inidiv.join(" og ");
            return this.points + " poeng " + child_descs;
        }
    }


}