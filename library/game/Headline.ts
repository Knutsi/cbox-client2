/**
 * Created by knutsi on 10/08/15.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class Headline {

        title:string;
        actions:Action[];

        static fromObject(obj:{}, actionsAvailable:Action[]):Headline {

            var headline = new Headline();

            headline.title = obj["Title"];

            // look up actions for each action ident:
            headline.actions = obj["ActionIdents"].map( (actionident) => {

                for(var i in actionsAvailable)
                    if(actionsAvailable[i].ident == actionident)
                        return actionsAvailable[i];

                console.log("Client package contains headline with action ident that does not exist:" + actionident);
                return null;
            });

            return headline;
        }

    }

}