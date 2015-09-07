/**
 * Created by knut on 9/6/2015.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class Scorekeeper {

        groups:{ [group:string] : ScorekeeperEntry[] } = {};

        add(statgroup:string, card:Scorecard, percentage:number) {

            if(!(statgroup in this.groups))
                this.groups[statgroup] = [];

            this.groups[statgroup].push(new ScorekeeperEntry(statgroup, card, percentage));
        }


        getStanding(group:string):number {
            if(!(group in this.groups) || this.groups[group].length < 3)
                return 0.0;

            var entries:ScorekeeperEntry[] = this.groups[group];

            // get average:
            return entries.reduce((pv, cv) => { return cv.percentage + pv; }, 0.0) / entries.length;
        }

    }

}
