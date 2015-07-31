/**
 * Created by knutsi on 23/07/15.
 */

/// <reference path="resources/unittest.ts" />

interface Window { RunPageController: UnitTest.RunPageController; }

module UnitTest {

    export class RunPageController {

        testListDiv:HTMLDivElement;
        outputDiv:HTMLDivElement;
        testList:string[] = [];
        pendingFrameList:HTMLIFrameElement[] = [];
        updateTimer:any;

        currentFrame:HTMLIFrameElement;


        constructor() {
            console.log("-- START --");
            console.log("RunPageController: init");

            // get UI-elements:
            this.testListDiv = <HTMLDivElement>document.querySelector("#testlist");
            this.outputDiv = <HTMLDivElement>document.querySelector("#output");

            // load the test list:
            var listreq = new XMLHttpRequest();
            listreq.open("GET", "../tests.json", true);
            listreq.onreadystatechange = () =>
            {
                if(listreq.readyState == 4 && listreq.status == 200) {
                    this.parseTestListJSON(listreq.responseText);
                    this.run();
                }
            };

            listreq.send();
        }


        parseTestListJSON(json_string:string) {
            var obj = JSON.parse(json_string);
            this.testList = obj.tests;
        }


        run() {
            this.testList.forEach( (test_script, i) => {

                // create iframe with test page for this test:
                var test_url = "resources/testpage.html?" + test_script;
                var iframe = <HTMLIFrameElement>document.createElement("iframe");
                iframe.src = test_url;
                iframe.id = "test_" + i;
                iframe.setAttribute("data-test-script", test_script);
                iframe.style.display = "none";

                this.outputDiv.appendChild(iframe);
                this.pendingFrameList.push(iframe);
            });

            this.updateTimer = setInterval(() => {this.updateFrameStates()}, 50);

            this.updateFrameStates();
        }


        updateFrameStates() {

            var done:HTMLIFrameElement[] = [];
            this.pendingFrameList.forEach( (frame) => {
                var controller = (<any>frame.contentWindow).PageController;

                if(controller && controller.complete)
                    done.push(frame);
            } );


            // output test results for each done frame:
            done.forEach( (frame) => {
                var controller = <UnitTest.TestPageController>(<any>frame.contentWindow).PageController;

                // get each test:
                controller.tests.forEach( (test) => {
                    console.log(test);

                    // test header:
                    var header = document.createElement("div");
                    header.className = "test_heading";
                    header.innerHTML = test.name;
                    this.testListDiv.appendChild(header);

                    // test's method results:
                    test.methodResults.forEach((result) => {
                        var div = document.createElement("div");

                        div.innerHTML = "<strong>" + result.methodName + "</strong> ";

                        if(result.passed) {
                            div.className = "test_listing passed";

                        } else {
                            div.className = "test_listing failed";
                            result.messages.forEach((m) => {
                                div.innerHTML += m + "; ";
                            })
                        }

                        // show frame on clock:
                        div.onclick = () => { this.showFrame(frame) };

                        this.testListDiv.appendChild(div);
                    })

                    /*// test's method results:
                     test.results.forEach((result) => {
                     var div = document.createElement("div");
                     div.innerHTML = "<strong>" + result.methodName + "</strong> " + result.message;
                     if(result.passed)
                     div.className = "test_listing passed";
                     else
                     div.className = "test_listing failed";

                     // show frame on clock:
                     div.onclick = () => { this.showFrame(frame) };

                     this.testListDiv.appendChild(div);
                     })*/

                })

            });

            // remove done items:
            done.forEach((frame) => {
                var index = this.pendingFrameList.indexOf(frame);
                this.pendingFrameList.splice(index, 1);
            });

            // stop timer if no need to check any more:
            if(this.pendingFrameList.length <= 0) {
                clearInterval(this.updateTimer);
                console.log("-- DONE --");
            }
        }


        showFrame(frame:HTMLIFrameElement) {
            if(this.currentFrame)
                this.currentFrame.style.display = "none";

            frame.style.display = "block";
            this.currentFrame = frame;
        }
    }


}


window.RunPageController = new UnitTest.RunPageController();