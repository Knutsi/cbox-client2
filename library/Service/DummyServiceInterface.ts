/**
 * Created by knut on 8/7/2015.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    /****
     * Dummy service interface for flow debugging.
     */
    export class DummyServiceInterface implements IServiceInterface{

        dummyScore:Scorecard = new Scorecard();

        startGame(
            specs:any,
            callback:(status:cbox.AsyncRequestResult, case_:cbox.Case)=>void)
        {
            // create a dummy case:
            var case_ = new Case();

            // demo problem 1:
            var prob1 = new Problem();
            prob1.ident = Case.ROOT_IDENT;
            prob1.title = "Root"

            prob1.addResultQuick("history.presenting.description", "Gradvis innsettende tungpust.");
            prob1.addResultQuick("history.age", "99", "NUMBER");
            prob1.addResultQuick("history.gender", "Kvinne");
            prob1.addResultQuick("history.past-conditions", "Tidligere frisk.");
            prob1.addResultQuick("history.social.children", "Tre friske barn.");
            prob1.addResultQuick("history.hereditary.conditions", "Ingen opphopning av sykdommer i familien.");
            prob1.addResultQuick("history.hereditary.sudden-deaths", "Ingen plutselige dødsall.");
            prob1.addResultQuick("history.hereditary.conditions", "Ingen opphopning av sykdommer i familien.");

            prob1.addResultQuick("clinic.cor", "Regelmessig aksjon, ingen bilyder.");
            prob1.addResultQuick("clinic.pulm", "Normale respirasjonslyder.  Ingen fremmelyder.");

            prob1.addResultQuick("lab.vblood.crp", Math.floor(Math.random() * 400), "NUMBER", "S-CRP");
            prob1.addResultQuick("lab.vblood.hemoglobin", "9.7", "NUMBER", "S-Hb");

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
            // dummy add some values:
            var problem = new Problem();
            problem.ident = "_root";
            problem.addResultQuick("lab.vblood.trombocytes", 432, "NUMBER", "TBC");

            // fake score:
            this.dummyScore.timeMS += 55000;
            this.dummyScore.risk += 0.1;
            this.dummyScore.comfort += 1;
            this.dummyScore.cost += 1000;

            callback(new AsyncRequestResult(true), [problem], [], this.dummyScore);
        }


        commitDnT(
            diagnosis:cbox.DiagnosisChoice[],
            treatments:cbox.TreatmentChoice[],
            callback:(
                status:cbox.AsyncRequestResult,
                followup:cbox.FollowupQuestion[])=>void)
        {
            callback(new AsyncRequestResult(true), DummyServiceInterface.demoQuestions);
        }


        commitFollowup(
            followup:cbox.FollowupQuestion[],
            callback:(
                status:cbox.AsyncRequestResult,
                score:cbox.FinalScore)=>void)
        {
            callback(new AsyncRequestResult(true), DummyServiceInterface.demoFinalScore);
        }


        static get demoQuestions() {
            var q1 = new FollowupQuestion();
            q1.question = "Hvilken form for lungekreft er sterkt assosiert med røyking, og en av de mest agressive?";
            q1.options = ["Småcellet", "Plateepitelkarsinom", "Storcellekarsinom"];
            q1.type = FollowupQuestion.TYPE_SINGLE_CHOICE;

            var q2 = new FollowupQuestion();
            q2.question = "Hvilke av de følgende er røde flagg ved ryggsmerter?";
            q2.options = [
                "Smerteintensitet varierer, ofte bedre i ro",
                "Utbredte og eventuelle progrediserende nevrologiske utfall",
                "Alder under 20 eller over 55 år",
                "Hosting/nysing reproduserer smerteutstrålingen"];
            q2.type = FollowupQuestion.TYPE_MULTIPLE_CHOICE;

            return [q1, q2];
        }


        static get demoFinalScore() {
            var fs = new FinalScore();

            fs.points = Math.floor(Math.random() * 100);
            fs.calculationComments = ["3 av 5 relevante diagnoser", "2 av 2 likeverdige behandlinger valg"];
            fs.caseComments = [
                "Primærdiagnose varicellapneumoni",
                "Pasient med høy risiko for lungecancer grunnet over 15 pakkeår"];

            return fs;
        }

    }

}