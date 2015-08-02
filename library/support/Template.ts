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
        public parsed:TemplateLine[] = [];
        public indentChar:string;
        public augmentIDs = true;
        private nextIDNumber = 1;

        constructor(source:string[], indent_char="-") {
            this.source = source;
            this.indentChar = indent_char;

            // parse the template:
            this.parsed = this.source.map((line) => { return new TemplateLine(line, this) });

            // validate:
            var indent = 0;
            this.parsed.forEach((line, i) => {

                // check no ident is greater than current + 1:
                if(line.indent > indent + 1)
                    throw "Template.render: line indent is > current line indent (line " + i + ")";
                else
                    indent = line.indent;
            })
        }


        get nextIDAugmentationNumber():number {
            this.nextIDNumber += 1;
            return this.nextIDNumber;
        }


        /***
         * Parses the template and provides a HTMLElement containing the output.
         * It can also augment an object with properties named after the elements in the
         * template having an id attribute.
         *
         * @returns {*}
         */
        render(augment:{} = null):HTMLElement {
            // parser state:
            var stack:Node[] = [];

            // run trough the source:
            var root = document.createElement("div");
            stack[0] = root;

            this.parsed.forEach( (line) => {

                // realise object (create it, render it etc.):
                var element = line.realise(augment);

                // if current indent is less than max stack, clear levers higher in stack:
                if(stack.length > line.indent)
                    stack.splice(line.indent+1, stack.length - line.indent);

                // set current element at it's place in the stack, and check we are not off numbers:
                stack[line.indent+1] = element;

                // append child to higher node:
                stack[line.indent].appendChild(element);
            });

            return root;
        }

    }
}