/**
 * Created by knut on 8/28/2015.
 */

/// <reference path="../../cboxclient.ts" />


module cbox.logicnode {

    export class LogicNodeBase {

        type:string;
        children:LogicNodeBase[] = [];
        object_:any;


        eval():boolean {
            throw "Not implemented";
        }


        get displayName():string {
            throw "Not implemented";
        }


        get object():any {
            return this.object_;
        }


        set object(value:any) {
            this.object_ = value;
            this.children.forEach( (c) => { c.object = value });
        }

        static instanceChildren(child_objects:any[]):LogicNodeBase[] {

            return child_objects.map( (o) => {
                var type = LogicNodeBase.getNodeType(o.type);
                return type.fromObject(o);
            }) ;
        }

        static getNodeType(type:string):any {
            switch (type) {

                case "LogicNode":
                    return LogicNode;

                case "IsTreatment":
                    return IsTreatment;

                case "LogicNodeTreeRoot":
                    return LogicNodeTreeRoot;
            }

            return LogicNodeBase;
        }


    }

}

