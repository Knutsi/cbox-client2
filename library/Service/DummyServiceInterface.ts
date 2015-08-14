/**
 * Created by knut on 8/7/2015.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    /****
     * Dummy service interface for flow debugging.
     */
    export class DummyServiceInterface implements IServiceInterface{

        startGame(
            specs:any,
            callback:(status:cbox.AsyncRequestResult, case_:cbox.Case)=>void)
        {
            // create a dummy case:
            var case_ = new Case();

            // demo problem 1:
            var prob1 = new Problem();
            prob1.ident = "_root";
            prob1.title = "Root"

            prob1.addResultQuick("history.presenting", "Gradvis insettende tungpust.");
            prob1.addResultQuick("history.age", "99", "NUMBER");
            prob1.addResultQuick("history.gender", "Kvinne");
            prob1.addResultQuick("history.past-conditions", "Tidligere frisk.");

            prob1.addResultQuick("clinex.cor", "Regelmessig aksjon, ingen bilyder.");
            prob1.addResultQuick("clinex.pulm", "Normale respirasjonslyder.  Ingen fremmelyder.");

            prob1.addResultQuick("lab.vblood.crp", "233", "NUMBER", "S-CRP");
            prob1.addResultQuick("lab.vblood.hb", "9.7", "NUMBER", "S-Hb");

            case_.addProblem(prob1);

            // demo problem 2:
            var prob2 = new Problem();
            prob2.ident = "rash1";
            prob2.title = "Utslett høyre ankel";
            prob2.classes = ["Swabbable"];

            prob2.addResultQuick("micbio.surface.swab", "Oppvekst av normalflora.");

            case_.addProblem(prob2);


            callback(new AsyncRequestResult(true), case_);
        }


        commitActions(
            actions:any,
            callback:(
                status:cbox.AsyncRequestResult,
                results:cbox.Problem[],
                assets:cbox.Asset[],
                score:cbox.Scorecard)=>void)
        {
            callback(new AsyncRequestResult(true), [], [], new Scorecard());
        }


        commitDnT(
            diagnosis:cbox.DiagnosisChoice[],
            treatments:cbox.TreatmentChoice[],
            callback:(
                status:cbox.AsyncRequestResult,
                followup:cbox.FollowupQuestion[])=>void)
        {
            callback(new AsyncRequestResult(true), []);
        }


        commitFollowup(
            followup:cbox.FollowupQuestion[],
            callback:(
                status:cbox.AsyncRequestResult,
                score:cbox.Scorecard,
                comments:string[])=>void)
        {
            callback(new AsyncRequestResult(true), new Scorecard(), []);
        }

    }

}