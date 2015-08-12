/**
 * Created by knutsi on 10/08/15.
 */

module cbox {

    export class Diagnosis {

        ident:string;
        code:string;
        title:string;

        static fromTabDelimitedLine(row:string):Diagnosis {

            var columns = row.trim().split("\t");
            if(columns.length != 2)
                throw "fromTabDelimitedLine column count != 2: " + columns.length;

            var dx = new Diagnosis();
            dx.ident = columns[0];
            dx.code = columns[0];
            dx.title = columns[1];

            return dx;
        }
    }

}