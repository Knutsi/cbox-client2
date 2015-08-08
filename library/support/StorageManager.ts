/**
 * Created by knut on 8/7/2015.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class StorageManager {

        serviceRootUrl:string;

        // internal fields:
        clientpackageRaw:{};

        classes:Class[]
        forms:Form[];
        actions:Action[];
        diagnosis:Diagnosis[];
        treatment:Treatment[];


        constructor(serviceRootUrl:string) {
            this.serviceRootUrl = serviceRootUrl;
        }


        /****
         * Loads the client package and parses it.
         * @param callback
         */
        load(callback:(status:AsyncRequestResult) => void) {
            console.log("Loading clientpackage");

            // creating request to load client package
            // *TODO* Make this cache using local storage - file will get big.
            var req = new XMLHttpRequest();
            req.open("GET", this.serviceRootUrl + "clientpackage.json", true);

            // handler to send response to parser if received:
            req.onreadystatechange = () => {
                if(req.readyState == 4 && req.status == 200) {
                    this.parseClientPackage(req.responseText);
                    callback(new AsyncRequestResult(true));
                } else if(req.readyState == 4) {
                    callback(new AsyncRequestResult(false));
                }
            }

            // fly little bird, fly!
            req.send();
        }


        parseClientPackage(text:string) {
            this.clientpackageRaw = JSON.parse(text);

            // parse
        }

    }

}