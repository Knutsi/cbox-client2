/**
 * Created by knutsi on 30/07/15.
 */

/// <reference path="TemplateLine.ts" />


module cbox {

    /***
     * Simple template system for cbox to ease development.
     *
     * Uses
     */
    export class Template {

        public source:string[];
        private parserState = {
            indentLevel: 0,
            stack: []
        };

        constructor(source:string[], indent_token="-") {
            this.source = source;
        }


        render():HTMLElement {
            // reset parser state:
            this.parserState.indentLevel = 0;
            this.parserState.stack = [];

            // run trough the source:
            var root = document.createElement("div");

            this.source.forEach( (src_line) => {

                // parse line:
                var line = this.parseLine(src_line);

                // realise object (create it, render it etc.):
                var line_element = this.realise(line);

                // if indent is higher than parent, add as child 





            });

            return root;
        }


        parseLine(str:string):TemplateLine {
            return new TemplateLine();
        }


        realise(line:TemplateLine):HTMLElement {

        }
    }
}