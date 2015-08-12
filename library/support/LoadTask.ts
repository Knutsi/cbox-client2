/**
 * Created by knutsi on 12/08/15.
 */

module cbox {

    export class LoadTask {

        title:string;
        done:boolean = false;
        ok:boolean = false;

        constructor(title) {
            this.title = title;
            this.done = false;
        }

        setOkAndDone() {
            this.ok = true;
            this.done = true;
        }

        setFailAndDone() {
            this.ok = false;
            this.done = true;
        }

    }

}