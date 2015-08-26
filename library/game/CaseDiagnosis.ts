/**
 * Created by knut on 8/25/2015.
 */

module cbox {

    export class CaseDiagnosis {

        code:string;
        title:string;
        group:string;
        major:boolean;
        specific:boolean;

        static fromObject(obj:{}) {

            var cd = new CaseDiagnosis();

            cd.code = obj['Code'];
            cd.title = obj['Title'];
            cd.group = obj['Group'];
            cd.major = obj['Major'];
            cd.specific = obj['Specific'];

            return cd;
        }


    }
}