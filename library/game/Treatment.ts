/**
 * Created by knutsi on 10/08/15.
 */

module cbox {

    export class Treatment {

        class_:string;
        ident:string;
        title:string;
        subspecIdents:string[];
        subspecs:Treatment[];
        modifiers:string[];


        static fromObject(obj:{}):Treatment {
            var treatment = new Treatment();

            treatment.class_ = obj["Class"];
            treatment.ident = obj["Ident"];
            treatment.title = obj["Title"];
            treatment.subspecIdents = obj["Subspecs"];
            treatment.modifiers = obj["Modifiers"];

            return treatment;
        }

    }

}