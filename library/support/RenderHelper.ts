/**
 * Created by knut on 8/14/2015.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class RenderHelper {

        static toStringOnlyCommas(results:TestResult[]):string {

            var str = "";

            results.forEach((result, i) => {

                str += RenderHelper.componentize(result.displayStringHTML);

                // comma if not final component:
                if(i != results.length - 1)
                    str += ", ";
            });

            return str;
        }

        static componentize(str:string):string {
            str = str.toLowerCase();
            str = RenderHelper.stripFinalDot(str);

            return str;
        }

        static stripFirstCapital(str:string):string {
            return str;
        }

        static stripFinalDot(str:string):string {
            return str;
        }

    }
}
