/**
 * Created by knut on 8/31/2015.
 */

/// <reference path="../../cboxclient.ts" />

module cbox {

    export class LogicNode {

        public static LOGIC_ALL_OF = "IF_ALL_OF";
        public static LOGIC_EITHER_OF = "IF_EITHER_OF";
        public static LOGIC_NONE_OF = "IF_NONE_OF";

        easyStrings = {
            'IF_ALL_OF' : "hvis alle av",
            'IF_EITHER_OF' : "hvis en eller flere av",
            'IF_NONE_OF' : "hvis ingen av"
        };

        type:string;
        logic:string = LogicNode.LOGIC_EITHER_OF;
        children:LogicNode[] = [];
        objects_:{}[] = [];


        eval():boolean {

            switch(this.logic) {

                case LogicNode.LOGIC_ALL_OF:
                    return this.children.length > 0 && this.positiveChildren == this.children.length;

                case LogicNode.LOGIC_EITHER_OF:
                    return this.positiveChildren > 0;

                case LogicNode.LOGIC_NONE_OF:
                    return this.positiveChildren == 0;

                default:
                    throw "Dang, logic node with unknown logic?  4th dimensional stuff? Logic is: " + this.logic;

            }
        }


        get matched():boolean
        {
            return this.eval()
        }


        set objects(objects:any[]) {

            // recusrively set all children to have these objects as theirs:
            this.objects_ = objects;
            this.children.forEach( (child) => {
                child.objects = objects;
            })
        }

        get objects():any[] {
            return this.objects_;
        }

        get positiveChildren():number
        {
            return this.children.reduce(
                (pv, child) => {
                    if(child.matched)
                        return pv +1;
                    else
                        return pv;
                }, 0);
        }


        get stringDescription():string {

            var str = this.easyStrings[this.logic];

            if(this.children.length > 0) {

                var child_descs = this.children.map((c) => { return c.stringDescription});

                if(this.logic == LogicNode.LOGIC_EITHER_OF)
                    str += " (" + child_descs.join(" eller ") + ")";
                else
                    str += " (" + child_descs.join(" og ") + ")";
            }

            return str;
        }


        static fromObjectInherited(obj:{}, node:LogicNode) {
            if("Logic" in obj)
                node.logic = obj['Logic'];

            if("Children" in obj)
                node.children = obj['Children'].map( (c) => { return ScoreTree.instanceNode(c); } );

            node.type = obj['Type'];
        }


        static fromObject(obj:{}):LogicNode {
            var node = new LogicNode();
            node.logic = obj['Logic'];
            node.children = obj['Children'].map( (c) => { return ScoreTree.instanceNode(c); } );

            return node;
        }
    }


}