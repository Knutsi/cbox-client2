/**
 * Created by knut on 9/2/2015.
 */


module cbox {

    export class ExportManifestoEntry {

        modelName:string;
        id:number;

        static fromObject(obj:{}):ExportManifestoEntry {
            var entry = new ExportManifestoEntry();

            entry.modelName = obj['ModelName'];
            entry.id = obj['ID'];

            return entry;
        }

    }

}