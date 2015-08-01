/**
 * Created by knutsi on 30/07/15.
 */

/// <reference path="Template.ts" />

module cbox {

    export enum TemplateLineCommand {
        HTML,
        CLASS,
        OBJECT,
        STRING
    }

    export class TemplateLine {

        indent:number = 0;
        command:TemplateLineCommand;
        commandToken:string;
        params:string[];
        text:string = null;
        src: string;

        constructor(src:string, template:Template) {
            this.src = src;

            // count indents:
            for(var i = 0; i < src.length; i++)
                if(src[i] == template.indentChar)
                    this.indent = i + 1;
                else
                    break;

            // detect command:
            this.commandToken = src[this.indent];
            this.params = src.substr(this.indent +1, src.length).split(" ");
            switch(this.commandToken) {
                case '.':
                    this.command = TemplateLineCommand.CLASS
                    break;

                case '!':
                    this.command = TemplateLineCommand.OBJECT;
                    break;

                case '\'':
                    this.command = TemplateLineCommand.STRING;
                    this.text = this.params.join(" ");
                    break;

                default:
                    this.command = TemplateLineCommand.HTML;
                    this.commandToken = null;   // irrelevant
            }

            // add parameters:


            console.log(this);
        }

    }


}