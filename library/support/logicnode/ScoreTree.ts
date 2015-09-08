/**
 * Created by knut on 8/31/2015.
 */

/// <reference path="../../cboxclient.ts" />

module cbox {

    export class ScoreTree {

        items:ConsequenceNode[] = [];
        objects_:any[];

        static fromObject(obj:any[]):ScoreTree {

            var tree = new ScoreTree();
            tree.items = obj.map((node) => { return ScoreTree.instanceNode(node) });
            return tree;
        }

        set objects(objects:any[]) {

            this.items.forEach((child) => { child.objects = objects; })
            this.objects_ = objects;

        }

        get objects():any[] {
            return this.objects_;
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
                result.scoreExplanation.push(conseq_node.stringDescription);
                result.comments = result.comments.concat(conseq_node.comments);
            });

            // remove 30% of score for each faulty Dx and Tx:
            var dx_obj = this.objects.filter( (o) => { return o instanceof Diagnosis} );
            var dxs = dx_obj.map( (o) => { return (<Diagnosis>o) } );
            var tx_obj = this.objects.filter( (o) => { return o instanceof TreatmentChoice} );
            var txs = tx_obj.map( (o) => { return (<TreatmentChoice>o).treatment } );
            var rewarding_dxcodes = this.pointProvidingDxNodes.map( (dx) => { return dx.code } );
            var rewarding_txidents = this.pointProvidingTxNodes.map( (tx) => { return tx.ident } );

            dxs.forEach((dx) =>
            {
                if(rewarding_dxcodes.indexOf(dx.code) == -1) {
                    result.scoreExplanation.push("-30% for feil diagnose \"" + dx.title + "\"");
                    result.score = result.score * (1 - 0.30);
                }
            });

            txs.forEach((tx) =>
            {
                if(rewarding_txidents.indexOf(tx.ident) == -1) {
                    result.scoreExplanation.push("-15% for behandling uten indikasjon \"" + tx.title + "\"");
                    result.score = result.score * (1 - 0.15);
                }
            });

            result.scoreExplanation = result.scoreExplanation.filter((e) => { return e.trim() != "" });

            // round final score:
            result.score = Math.round(result.score);
            return result;
        }


        get allNodes():LogicNode[] {

            var nodes = [];

            // recursive function to grab all nodes:s
            var walker = (node:LogicNode) => {
                if(nodes.indexOf(node) != -1)
                    return;

                nodes.push(node);
                node.children.forEach((c) => { walker(c) });
            };

            this.items.forEach( (c) => { walker(c) });

            return nodes;
        }

        getParent(node:LogicNode):LogicNode {
            var parent = this.allNodes.filter( (n) => { return n.children.indexOf(node) != -1 });
            if(parent.length <= 0)
                return null;
            else
                return parent[0];
        }

        getAncenstry(node:LogicNode):LogicNode[] {

            var ancestors:LogicNode[] = [];

            var parent =  this.getParent(node);
            while(parent) {
                ancestors.push(parent);
                parent = this.getParent(parent);
            }

            return ancestors;
        }

        get allTxNodes():TreatmentNode[] {
            var nodes = this.allNodes.filter( (n) => { return n instanceof TreatmentNode } );
            return nodes.map( (n) => { return <TreatmentNode>n } );
        }


        get allDxNodes():DiagnosisNode[] {
            var nodes = this.allNodes.filter( (n) => { return n instanceof DiagnosisNode } );
            return nodes.map( (n) => { return <DiagnosisNode>n } );
        }




        /**
         * Simply returns a list of nodes that have a points provider as their ancestor.
         * */
        get pointProvidingDxNodes():DiagnosisNode[] {

            return this.allDxNodes.filter( (dx_n) => {

                // is this node relative of a points node?
                return this.getAncenstry(dx_n).some( (a) => { return a instanceof PointsNode })
            });
        }


        get nonPointProvidingDxNodes():DiagnosisNode[] {

            return this.allDxNodes.filter( (dx_n) => {

                // is this node relative of a points node?
                return !this.getAncenstry(dx_n).some( (a) => { return a instanceof PointsNode })
            });
        }


        /**
         * Returns Dx-nodes that have a direct path to a points node with only "yes" and
         * "maybe" positive hints.
         * */
        get pointProvidingTxNodes():TreatmentNode[] {
            return this.allTxNodes.filter( (dx_n) => {

                // is this node relative of a points node?
                return this.getAncenstry(dx_n).some( (a) => { return a instanceof PointsNode })
            });
        }


        get nonPointProvidingTxNodes():TreatmentNode[] {
            return this.allTxNodes.filter( (dx_n) => {

                // is this node relative of a points node?
                return !this.getAncenstry(dx_n).some( (a) => { return a instanceof PointsNode })
            });
        }

    }


}