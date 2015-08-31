/**
 * Created by knut on 8/31/2015.
 */

/// <reference path="../../cboxclient.ts" />

module cbox {

    export class ScoreTree {

        items:ConsequenceNode[] = [];

        static fromObject(obj:any[]):ScoreTree {

            var tree = new ScoreTree();
            tree.items = obj.map((node) => { return ScoreTree.instanceNode(node) });
            return tree;
        }

        set objects(objects:any[]) {

            this.items.forEach((child) => { child.objects = objects; })

        }

        static instanceNode(obj:{}):any {

            var type = null;
            switch(obj['Type']) {

                case "ConsequenceNode":
                    type = ConsequenceNode;
                    break;

                case "LogicNode":
                    type = LogicNode;
                    break;

                case "PointsNode":
                    type = PointsNode;
                    break;

                case "TreatmentNode":
                    type = TreatmentNode;
                    break;

                case "DiagnosisNode":
                    type = DiagnosisNode;
                    break;

                case "TestNode":
                    type = TestNode;
                    break;

                default:
                    throw "Could not insance logic node of type: " + obj['Type'];
            }

            // let type take care of rest:
            var node = type.fromObject(obj);
            return node;
        }


        get result():Result {

            var result = new Result();

            this.items.forEach( (conseq_node) => {
                //score:
                result.score += conseq_node.points;
                result.maxScore  += conseq_node.maxPoints;

                // comments:
                /*var points_nodes = conseq_node.children.filter( (c) => { return c instanceof PointsNode});
                var expl_comments = points_nodes.map( (n:LogicNode) => { return n.stringDescription});
                result.scoreExplanation = result.scoreExplanation.concat(expl_comments);*/
                result.scoreExplanation.push(conseq_node.stringDescription);

                result.comments = result.comments.concat(conseq_node.comments);
            });

            result.scoreExplanation = result.scoreExplanation.filter((e) => { return e.trim() != "" });

            return result;
        }

    }


}