/**
 * Created by knut on 8/28/2015.
 */

/// <reference path="../../cboxclient.ts" />


module cbox.logicnode {

    export class LogicNode extends LogicNodeBase {

        public static LOGIC_TYPE_AND = "AND";
        public static LOGIC_TYPE_OR = "OR";
        public static LOGIC_TYPE_N_OF = "N_OF";
        public static LOGIC_TYPE_NOT = "NEITHER";

        logicType:string = LogicNode.LOGIC_TYPE_AND;
        n:number = 0;

        constructor() {
            super();
            this.type = "LogicNode";
        }


        eval():boolean {
            switch(this.logicType) {

                case LogicNode.LOGIC_TYPE_AND:
                    return this.evalAnd();

                case LogicNode.LOGIC_TYPE_OR:
                    return this.evalOr();

                case LogicNode.LOGIC_TYPE_N_OF:
                    return this.evalNOf();

                case LogicNode.LOGIC_TYPE_NOT:
                    return this.evalNeither();

                default:
                    throw "Unknown logic type set for LogicNode.eval()";
            }
        }

        private evalAnd():boolean {
            return this.positiveChildren == this.children.length;
        }

        private evalOr():boolean {
            return this.positiveChildren >= 1;
        }

        private evalNOf():boolean {
            return this.positiveChildren == this.n;
        }

        evalNeither():boolean {
            return this.positiveChildren == 0;
        }


        private get positiveChildren():number {

            return this.children.reduce( (pv, child) => {
                if(child.eval())
                    return pv + 1;
                else
                    return 0;

            }, 0);
        }

        get displayName():string {
            return this.logicType;
        }

        static fromObject(obj:{}):LogicNode {

            var node = new LogicNode();
            node.logicType = obj['LogicType'];
            node.children = LogicNodeBase.instanceChildren(obj['Children']);

            return node;
        }


    }

}

