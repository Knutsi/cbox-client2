/**
 * Created by knutsi on 30/07/15.
 */

/// <reference path="TemplateLine.ts" />

module cbox {


    export class Template {

        source:string;

        constructor(source:string, indent_token="\t") {
            this.source = source;

            this.parse();
        }

        private parse() {

        }

        render():HTMLElement {

            return document.createElement("ul");
        }

    }
}