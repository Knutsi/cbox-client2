/**
 * Created by knut on 8/28/2015.
 */

/// <reference path="../../cboxclient.ts" />


module cbox.logicnode {

    export class LogicNodeTreeRoot extends LogicNodeBase {

        name:string;

        constructor() {
            super();
            this.type = "LogicNodeTreeRoot";
        }


        /**
         * Deserializes base on node type
         * ***/
        static fromObject(obj:{}):LogicNodeTreeRoot {

            var root = new LogicNodeTreeRoot();
            root.name = obj['Name'];
            root.children = LogicNodeBase.instanceChildren(obj['Children']);

            return root;
        }
    }

}