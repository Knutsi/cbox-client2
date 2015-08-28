/**
 * Created by knutsi on 10/08/15.
 */

module cbox {

    export class Treatment {

        class_:string;
        ident:string;
        title:string;
        tradenames:string[];
        searchIndex:string;
        modifiers:string[];


        static fromObject(obj:{}):Treatment {
            var treatment = new Treatment();

            treatment.class_ = obj["Class"];
            treatment.ident = obj["Ident"];
            treatment.title = obj["Title"];
            treatment.tradenames = obj["Subspecs"];
            treatment.modifiers = obj["Modifiers"];

            if(treatment.class_ == "substance")
                treatment.modifiers = ["Øk dose", "Reduser dose", "Legg til", "Seponer"];

            // index for reach:
            treatment.searchIndex = treatment.title + ", " + treatment.tradenames.join(", ");

            return treatment;
        }

    }

}