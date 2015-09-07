/**
 * Created by knut on 8/31/2015.
 */

/// <reference path="../../cboxclient.ts" />

module cbox {

    export class ConsequenceNode extends LogicNode {

        public static TYPE_FAIL_FOR = "FAIL_ON";
        public static TYPE_HIGEST_OF = "HIGHEST_OF";
        public static TYPE_SUM_OF = "SUM_OF";
        public static TYPE_COMMENT_FOR = "COMMENT_ON";

        group:string;
        consequence:string;
        matchedComment:string = "";
        unmatchedComment:string = "";

        static fromObject(obj:{}):ConsequenceNode {
            var node = new ConsequenceNode();
            LogicNode.fromObjectInherited(obj, node);

            node.group = obj["Group"];
            node.consequence = obj["Consequence"];
            node.matchedComment = obj["MatchedComment"];
            node.unmatchedComment = obj["UnmatchedComment"];

            return node;
        }


        get points():number {

            var point_nodes = this.children.filter( (n) => { return n instanceof PointsNode && n.matched });

            var highest = 0;
            var sum = 0;

            point_nodes.forEach( (n:PointsNode) => {
                if(n.points > highest)
                    highest = n.points;

                sum += n.points;
            });

            // return finding:
            if(this.consequence == ConsequenceNode.TYPE_HIGEST_OF)
                return highest;
            else if(this.consequence == ConsequenceNode.TYPE_SUM_OF)
                return sum;
            else
                return 0;
        }


        get maxPoints():number {

            var point_nodes = this.children.filter( (n) => { return n instanceof PointsNode });
            var points = point_nodes.map( (n:PointsNode) => { return n.points });

            if(this.consequence == ConsequenceNode.TYPE_SUM_OF){
                return points.reduce((pv, cv) => { return pv + cv}, 0);
            }
            else if(this.consequence == ConsequenceNode.TYPE_HIGEST_OF) {
                if(points.length > 0)
                    return points.sort()[0];
                else
                    return 0;
            }
            else
                return 0;

        }

        get comments():string[] {

            var comments = [];

            // are we a comments node?
            if(this.consequence == ConsequenceNode.TYPE_COMMENT_FOR) {
                if(this.matched)
                    comments.push(this.matchedComment);
                else
                    comments.push(this.unmatchedComment);
            }

            // are we a points node?
            if(this.consequence == ConsequenceNode.TYPE_HIGEST_OF || this.consequence == ConsequenceNode.TYPE_SUM_OF)
            {
                // matched comments:
                var matched_pnodes = this.children.filter( (n) => { return n instanceof PointsNode && n.matched } );
                var unmatched_pnodes = this.children.filter( (n) => { return n instanceof PointsNode && !n.matched } );

                var matched_comments = matched_pnodes.map( (n:PointsNode) => { return n.matchedComment });
                var unmatched_comments = unmatched_pnodes.map( (n:PointsNode) => { return n.unmatchedComment });

                matched_comments.concat(unmatched_comments).forEach((c) => { comments.push(c) });
            }

            // clean and return:
            return comments.filter( (c) => {
                if(!c)
                    return false;

                return c.trim() != ""
            } );
        }


        get stringDescription():string {

            var str = "";

            if(this.consequence == ConsequenceNode.TYPE_HIGEST_OF) {

                if(this.children.length > 1)
                    str += "Høyeste av (";

                str += this.children.map((c) => {return c.stringDescription}).join(" eller ")

                if(this.children.length > 1)
                    str += ")";

            } else if(this.consequence == ConsequenceNode.TYPE_SUM_OF) {
                if(this.children.length > 1)
                    str += "Summen av (";

                str += "(" +this.children.map((c) => {return c.stringDescription}).join(" og ") + ")";

                if(this.children.length > 1)
                    str += ")";
            }

            return str;
        }
    }


}