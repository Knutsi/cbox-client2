/**
 * Created by knutsi on 10/08/15.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class Form {

        headlines:Headline[];
        ident:string;
        title:string;


        static fromObject(obj:{}, actions:Action[]):Form {

            var form = new Form();

            form.headlines = obj["Headlines"].map( (h) => { return Headline.fromObject(h, actions); } );
            form.ident = obj["Ident"];
            form.title = obj["Title"];

            return form;
        }


    }

}