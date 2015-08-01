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
        private parserState = {
            indentLevel: 0,
            stack: []
        };

        constructor(source:string[], indent_char="-") {
            this.source = source;
            this.indentChar = indent_char;

            // parse the template:
            this.parsed = this.source.map((line) => { return new TemplateLine(line, this) })

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

        /***
         * Parses the template and provides a HTMLElement containing the output.
         * It can also augment an object with IDs
         *
         * @returns {*}
         */
        render(augment:{} = null):HTMLElement {
            // parser state:
            var stack:HTMLElement[] = [];

            // run trough the source:
            var root = document.createElement("div");
            stack[0] = root;

            this.parsed.forEach( (line, i) => {

                // realise object (create it, render it etc.):
                var element = this.realise(line);

                // if current indent is less than max stack, clear levers higher in stack:
                if(stack.length > line.indent)
                    stack.splice(line.indent, stack.length - line.indent);

                // set current element at it's place in the stack, and check we are not off numbers:
                stack[line.indent] = element;

                // append child to higher node:
                stack[line.indent - 1].appendChild(element);
            });

            return root;
        }



        realise(line:TemplateLine):HTMLElement {
            return document.createElement("div");
        }
    }
}