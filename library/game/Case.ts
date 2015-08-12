/**
 * Created by knutsi on 07/08/15.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class Case {

        static ROOT_IDENT:string = "_Root";

        problems:Problem[] = [];

        extend(new_results:Problem[]) {

            throw "Not implemented!";
        }


        get rootProblem():Problem {

            for(var i in this.problems) {

                if(this.problems[i].ident == Case.ROOT_IDENT)
                    return this.problems[i];

                return null;    // should never really get here..
            }
        }


    }


}