/**
 * Created by knutsi on 30/07/15.
 */

/// <reference path="Template.ts" />

module cbox {

    export class TemplateLineCommand {
        static HTML = "HTML";
        static CLASS = "CLASS";
        static OBJECT  = "OBJECT";
        static STRING = "STRING";
    }

    export class TemplateLine {

        indent:number = 0;
        command:TemplateLineCommand;
        commandToken:string;
        params:string[];
        text:string = null;
        src: string;

        template:Template;

        constructor(src:string, template:Template) {
            this.src = src;
            this.template = template;

            // count indents:
            for(var i = 0; i < src.length; i++)
                if(src[i] == template.indentChar)
                    this.indent = i + 1;
                else
                    break;

            // detect command:
            this.commandToken = src[this.indent];
            this.params = src.substr(this.indent +1, src.length).split(" ");

            // interpret command token:
            switch(this.commandToken) {
                case '.':
                    this.command = TemplateLineCommand.CLASS:
                    break;

                case '!':
                    this.command = TemplateLineCommand.OBJECT;
                    break;

                case '\'':
                    this.command = TemplateLineCommand.STRING;
                    this.text = this.params.join(" ");
                    this.text = this.text.substr(0, this.text.length -1 );
                    break;

                default:
                    this.command = TemplateLineCommand.HTML;
                    this.commandToken = null;   // irrelevant
            }

            // for HTML commands, there is not initial token, so params start one position left:
            if(this.command == TemplateLineCommand.HTML)
                this.params = src.substr(this.indent, src.length).split(" ");

            //console.log(this);
        }

        get paramsDict():{} {

            var result = {};

            for(var i = 0; i <= this.params.length; i++) {
                var regex = /(.*)=\'(.*)\'/g;
                var matches = regex.exec(this.params[i]);
                if(matches)
                    result[matches[1]] = matches[2];
            }

            //console.log(result);
            return result;
        }

        /***
         * Creates a html-element from the line.  Will return a HTML element, or null
         * if the command modifies the paren
         */
        realise(prop_target):Node {
            switch (this.command) {
                case TemplateLineCommand.HTML:
                    return this.realiseCmdHTML(prop_target);

                case TemplateLineCommand.CLASS:
                    return this.realiseCmdClass(prop_target);

                case TemplateLineCommand.STRING:
                    return this.realiseCmdString(prop_target);

                case TemplateLineCommand.OBJECT:
                    return this.realiseCmdObject(prop_target);

            }
        }

        realiseCmdHTML(prop_target):HTMLElement {
            var element = document.createElement(this.params[0]);

            this.addElementAttributes(element);

            // augment property target object with a property who's key is the id and value the element:
            if(this.paramsDict['id'])
                prop_target[this.paramsDict['id']] = element;

            return element;
        }


        realiseCmdClass(prop_target):HTMLElement {
            var element = <HTMLDivElement>document.createElement("div");
            element.className = this.params[0];

            this.addElementAttributes(element);

            return element;
        }


        realiseCmdString(prop_target):any {
            return document.createTextNode(this.text)
        }


        realiseCmdObject(prop_target):HTMLElement {
            // objects are javascript objects that create their own HTML-strucutre.


        }

        addElementAttributes(element:HTMLElement) {
            // add all params as attributes, augment ID if needed:
            for(var key in this.paramsDict) {

                if(key == 'id' && this.template.augmentIDs)
                    element.setAttribute(key, this.paramsDict[key] + "_" + this.template.nextIDAugmentationNumber);
                else
                    element.setAttribute(key, this.paramsDict[key]);

            }
        }


    }


}