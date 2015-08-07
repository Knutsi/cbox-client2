/**
 * Created by knutsi on 07/08/15.
 */

module cbox {

    export class ClientState {
        static ERROR = "ERROR";

        static UNINITILIAZED = "UNINITILIAZED";
        static LOADING = "LOADING";
        static READY = "READY";

        static AWAIT_PLAYING_CASE = "AWAIT_PLAYING_CASE";
        static PLAYING_CASE = "PLAYING_CASE";

        static AWAIT_PLAYING_FOLLOWUP= "AWAIT_PLAYING_FOLLOWUP";
        static PLAYING_FOLLOWUP = "PLAYING_FOLLOWUP";

        static AWAIT_SCORE_AND_COMMENT = "AWAIT_SCORE_AND_COMMENT";
        static SCORE_AND_COMMENT = "SCORE_AND_COMMENT";
    }


}