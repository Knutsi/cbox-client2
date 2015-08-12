/**
 * Created by knutsi on 07/08/15.
 */


module cbox {

    export class Action {

        cost:number;
        ident:string;
        pain:number;
        risk:number;
        targetClasses:string[];
        title:string;
        yields:string[];

        static fromObject(obj:{}):Action {

            var action = new Action();

            action.cost = obj["Cost"];
            action.ident = obj["Ident"];
            action.pain = obj["Pain"];
            action.risk = obj["Risk"];
            action.targetClasses = obj["TargetClasses"];
            action.title = obj["Title"];
            action.yields = obj["Yield"];

            return action;
        }

    }

}

