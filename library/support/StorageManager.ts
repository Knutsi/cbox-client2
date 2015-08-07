/**
 * Created by knut on 8/7/2015.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class StorageManager {

        load(callback:(status:AsyncRequestResult) => void) {
            callback(new AsyncRequestResult(true));
        }

    }

}