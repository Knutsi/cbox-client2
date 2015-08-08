/**
 * Created by knut on 8/8/2015.
 */

module cbox {

    export class PageController {

        constructor() {

        }


        run() {
            throw "Not implemented";
        }

        element(id:string):HTMLElement {
            return <HTMLElement>document.querySelector("#" + id);
        }

    }

}