/**
 * Created by knut on 9/6/2015.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class ScorekeeperEntry {
        group:string;
        card:Scorecard;
        percentage:number;

        constructor(group, card, percentage) {
            this.group = group;
            this.card = card;
            this.percentage = percentage;
        }
    }
}