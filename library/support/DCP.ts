/**
 * Created by knut on 9/9/2015.
 */

module cbox {

    export class DCP {

        static DELAY = 3000;

        public static entries: { [key:string]:number; } = {};

        /*static protect(ident:string, callback) {

            var ms_now = Date.now();

            // if a value ahs been registered, and we are withing the quaranteen time, we skip:
            var exec = true;
            if(ident in DCP.entries && (Date.now() - DCP.entries[ident]) < DCP.DELAY)
                exec = false;

            // if not in quaranteen, execute callback as requested:
            if(exec) {
                callback();
                DCP.entries[ident] = ms_now;
            }
        }*/

        static isReady(ident:string) {
            var ms_now = Date.now();

            // if a value ahs been registered, and we are withing the quaranteen time, we skip:
            var exec = true;
            if(ident in DCP.entries && (Date.now() - DCP.entries[ident]) < DCP.DELAY) {
                exec = false;
                console.log("Dual click protection: no exec");
            }


            // if not in quaranteen, execute callback as requested:
            if(exec) {
                DCP.entries[ident] = ms_now;
                return true;
            } else {
                return false;
            }
        }

    }

}