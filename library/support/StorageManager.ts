/**
 * Created by knut on 8/7/2015.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class StorageManager {

        serviceRootUrl:string;

        // loading tasks undertaken by the storage manager:
        tasks:LoadTask[] = [];
        taskCheckInterval:any;

        // internal fields:
        clientpackageRaw:{};
        treatmentPackageRaw:{};

        forms:Form[];
        actions:Action[];
        diagnosis:Diagnosis[];
        treatments:Treatment[];

        // events:
        onLoadDone:Event<GenericEventArgs> = new Event<GenericEventArgs>();

        constructor(serviceRootUrl:string) {
            this.serviceRootUrl = serviceRootUrl;
        }


        /****
         * Loads the client package and parses it.
         * @param callback
         */
        load(callback:(status:AsyncRequestResult) => void) {
            console.log("Loading clientpackage");

            // set up the tasks to load:
            var cp_task = new LoadTask("Client package");
            var dx_task = new LoadTask("Diagnosis package");
            var rx_task = new LoadTask("Treatment");
            this.tasks.push(cp_task, dx_task);

            // load and parse client package:
            this.loadAndParse(
                cp_task,
                this.serviceRootUrl + "clientpackage.json",
                (task:LoadTask, data:string) => { this.parseClientPackage(task, data) });

            // load and parse diagnosis table:
            this.loadAndParse(
                dx_task,
                this.serviceRootUrl + "icd10no.txt",
                (task:LoadTask, data:string) => { this.parseICD10(task, data) });

            // load and parse treatment package:
            this.loadAndParse(
                rx_task,
                this.serviceRootUrl + "treatments_fest.json",
                (task:LoadTask, data:string) => { this.parseTreatmentPackage(task, data) });

            // run a timer to check if tasks are done:
            this.taskCheckInterval = setInterval(() => {
                if(this.allDone) {
                    console.log("StorageManager: all tasks done");
                    callback(new AsyncRequestResult(true));
                    this.onLoadDone.fire(new GenericEventArgs());
                    clearInterval(this.taskCheckInterval);
                }

            }, 100);
        }


        loadAndParse(task:LoadTask, url, parser) {
            // creating request to load client package
            // *TODO* Make this cache using local storage - file will get big.
            var req = new XMLHttpRequest();
            req.open("GET", url, true);

            // handler to send response to parser if received:
            req.onreadystatechange = () => {
                if(req.readyState == 4 && req.status == 200) {
                    parser(task, req.responseText);
                    task.setOkAndDone();
                } else if(req.readyState == 4) {
                    task.setFailAndDone();
                }
            }

            // fly little bird, fly!
            req.send();
        }



        parseClientPackage(task:LoadTask, text:string) {
            this.clientpackageRaw = JSON.parse(text);

            var cp = this.clientpackageRaw;

            // parses:
            this.actions = cp["Actions"].map((a) => { return Action.fromObject(a) });
            this.forms = cp["Forms"].map( (f) => { return Form.fromObject(f, this.actions) });

            task.ok = true;
        }


        parseICD10(task:LoadTask, text:string) {

            var rows = text.split("\n");
            this.diagnosis = rows.map( (r) => { return Diagnosis.fromTabDelimitedLine(r) });

            task.ok = true;
        }

        parseTreatmentPackage(task:LoadTask, text:string) {

            // two passes nessesary: (1) get objects,
            this.treatmentPackageRaw = JSON.parse(text);
            this.treatments = this.treatmentPackageRaw["Treatments"].map( (t) => { return Treatment.fromObject(t) });

            // (2) assign subspecs:
            this.treatments.forEach((treatment) => {
                if(treatment.subspecIdents)
                    treatment.subspecs = treatment.subspecIdents.map( (ident) => { return this.getTreatment(ident); })
                else
                    treatment.subspecs = null;
            });

            task.ok = true;
        }


        private getTreatment(ident:string):Treatment {
            for(var i in this.treatments)
                if(this.treatments[i].ident.toLowerCase() == ident.toLowerCase())
                    return this.treatments[i];

            return null;
        }


        get allDone():boolean {

            for(var i in this.tasks)
                if(!this.tasks[i].done)
                    return false;

            return true;
        }


        get allOK():Boolean {
            for(var i in this.tasks)
                if(!this.tasks[i].ok)
                    return false;

            return true;
        }


        get headlines():Headline[] {
            var headlines:Headline[] = [];
            this.forms.forEach( (f) => { headlines = headlines.concat(f.headlines);});

            return headlines;
        }
    }

}














