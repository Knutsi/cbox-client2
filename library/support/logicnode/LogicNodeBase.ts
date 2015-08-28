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

    }

}

