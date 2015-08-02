/**
 * Created by knutsi on 23/07/15.
 */

//interface Window { PageController: UnitTest.TestPageController; }
//window.PageController = window.PageController || {};

module UnitTest {

    export class TestPageController {

        testScriptAddress:string;
        tests:Test[] = [];
        complete = false;


        constructor() {
            // notify controller is created:
            console.log("TestPageController: created");
            this.loadTestScript();

            document.body.onload = () => { this.run(); };
        }


        /***
         * Looks in the URL of the page to loacate and load the external script.  Listens for the load
         * event, then runs the tests.
         */
        loadTestScript() {
            this.testScriptAddress = location.search.replace('?', '');
            console.log("TestPageController: loading test from " + this.testScriptAddress);

            var script = <HTMLScriptElement>document.createElement("script");
            script.src = this.testScriptAddress;
            script.type = "text/javascript";
            document.head.appendChild(script);

            // handle success:
            script.onload = () => {
                console.log("Loaded " + this.testScriptAddress);
            };

            // handle failiure:
            script.onerror = () => {
                //this.registerResult(null, "(INTERNAL)",  false, "Failed to load test script");
            }

        }

        /***
         * Runs the tests registered.
         */
        run() {


            // for each test:
            this.tests.forEach((test) => { test.run(); });
            this.complete = true;
        }


        /***
         * Registers the results of a test.
         * @param test
         */
        registerTest(test:Test) {
            this.tests.push(test);
            console.log("TestPageController: Registered test " + test.name);
        }


        /***
         * Registers the result of an assertion.
         */
        get results():TestResult[] {
            var results:TestResult[] = [];

            this.tests.forEach((test) => {

                test.results.forEach((result) => {
                    results.push(result);
                });

            });

            return results;
        }


        /***
         * Returns tests not passed.
         * @returns {number}
         */
        get failedTests():TestResult[] {
            return this.results.filter((r) => { return !r.passed })
        }


        /***
         * Returns tests passed.
         * @returns {number}
         */
        get passedTests():TestResult[] {
            return this.results.filter((r) => { return r.passed })
        }
    }


    export class Test {

        // name used in reporting
        public name:string = "Untitled test";

        // results of the run:
        public results:TestResult[] = [];

        // required scripts, list of URLs to load before running script:
        public dependencies:string[] = [];

        // state management while running tests:
        private currentMethod = "";

        output1:HTMLDivElement;
        output2:HTMLDivElement;
        output3:HTMLDivElement;


        constructor(name:string) {
            this.name = name;
            console.log("Test '" + this.name + "' created");

            // register with page controller:
            if(!window.PageController)
                throw "Window does not have a test page controller";

            window.PageController.registerTest(this);
        }


        public run() {
            console.log(this.name + " -> run()");

            // grab divs:
            this.output1 = <HTMLDivElement>document.querySelector("#output1");
            this.output2 = <HTMLDivElement>document.querySelector("#output2");
            this.output3 = <HTMLDivElement>document.querySelector("#output3");

            // get all test methods:
            var test_methods = [];
            for(var m in this) {
                if(typeof this[m] == "function" && m.indexOf("Test") == 0) {
                    test_methods.push(m);
                }
            }

            // execute each method:
            test_methods.forEach((method) => {
                this.currentMethod = method;
                //try {
                    this[method]();
                //} catch (e) {
                  //  this.reportFail("Exception in '" + this.currentMethod + "' :" + e);
                //}
            });
        }


        private get resultsByMethod():{[methodName: string]: TestResult[]; } {
            var results:{[methodName: string]: TestResult[]; } = {};

            // make a dict with all the results by method name:
            this.results.forEach( (result:TestResult) => {
                if(!results[result.methodName])
                    results[result.methodName] = [];

                results[result.methodName].push(result);
            });

            return results;
        }

        public get methodResults():MethodResult[] {

            var results:MethodResult[] = [];

            for(var key in this.resultsByMethod) {
                var methres = new MethodResult();
                methres.methodName = key;
                methres.results = this.resultsByMethod[key];
                results.push(methres);
            }

            return results;
        }

        private reportOK() {
            this.results.push(new TestResult(this, this.currentMethod, true));
        }


        private reportFail(message:string) {
            this.results.push(new TestResult(this, this.currentMethod, false, message));
        }


        /***
         * Checks if a and b are the same.
         * @param a
         * @param b
         * @constructor
         */
        public assertEqual(a:any, b:any) {
            if(a == b)
                this.reportOK();
            else
                this.reportFail(a + " not equal to " + b);
        }


        public assertTrue(a) {
            if(a == true)
                this.reportOK();
            else
                this.reportFail("Value is not 'true'");
        }

        public assertNotTrue(a) {
            if(a != true)
                this.reportOK();
            else
                this.reportFail("Value is 'true'");
        }

        public assertExcepts(func) {
            var excepted = false;
            try {
                if(typeof func == "function")
                    func();
                else
                    this.reportFail("Argument is not a function");

            } catch(e) {
                excepted = true;
            } finally {
                if(excepted)
                    this.reportOK();
                else
                    this.reportFail("Did not raise exception");
            }

        }

    }


    /***
     * Represents the results of a test-assertion, such as AssertEqual.
     */
    export class TestResult {
        test:Test = null;
        methodName:string;
        passed:boolean = false;
        message:string = null;


        constructor(test:Test, methodName:string, passed:boolean, message:string = "") {
            this.test = test;
            this.methodName = methodName;
            this.passed = passed;
            this.message = message
        }


        toString():string {

            var status = " [NOT PASSED] ";

            if(this.passed == true)
                status = " [PASSED] ";

            var message = "";
            if(this.message)
                message = ": " + this.message;

            return this.methodName + status + message;
        }
    }

    export class MethodResult {
        methodName:string;
        results:TestResult[] = [];

        get passed():boolean {
            for(var i in this.results)
                if(!this.results[i].passed)
                    return false;

            return true;
        }

        get messages():string[] {
            return this.results.map(
                (r) => { return r.message }
            ).filter(
                (m) => {return m.trim() != "";}
            );
        }
    }

}


// create the test page controller:
if(!window.PageController) {
    window.PageController = new UnitTest.TestPageController();
}