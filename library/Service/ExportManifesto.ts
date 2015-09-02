/**
 * Created by knut on 9/2/2015.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class ExportManifesto {

        entries:ExportManifestoEntry[];

        static fromObject(obj:{}):ExportManifesto {

            var manifesto = new ExportManifesto();

            manifesto.entries = obj["Cases"].map((e) => { return ExportManifestoEntry.fromObject(e) });

            return manifesto;
        }


        get caseCount():number{
            return this.entries.length;
        }

        identsByModel(model_name:string):ExportManifestoEntry[] {

            return this.entries.filter( (e) => { return e.modelName == model_name });

        }

        randomIdentFromModel(model_name:string):ExportManifestoEntry {

            var entries = this.identsByModel(model_name);
            var index = Math.round(Math.random() * (entries.length - 1));
            return entries[index];
        }

        get randomEntry():ExportManifestoEntry {
            var index = Math.round(Math.random() * (this.caseCount - 1));
            return this.entries[index];
        }

    }

}