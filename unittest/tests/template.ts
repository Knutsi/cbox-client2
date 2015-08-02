/**
 * Created by knutsi on 30/07/15.
 */

/// <reference path="../runner/resources/unittest.ts" />
/// <reference path="../../library/cboxclient.ts" />

class TemplateTest extends UnitTest.Test {

    element_template = [
        "ul id='mylist'",
        "-li",
        "--'Bread'",
        "-li",
        "--'Butter'",
        "-li",
        "--'Milk'",
        "p id='myparagraph' class='bold' style='font-weight:bold;'",
        "-'Demo mode!'"
    ];

    div_template = [
        ".wrapper id='demo'",
        "-.header",
        "-.content",
        "--.headline",
        "--.paragraph",
        "-.footer",
        ".wrapper"
    ];

    component_template = [
        "div id='demo'",
        "-div id='wrapper'",
        "--!CustomElement id='c1'",
        "--!CustomElement id='c2'",
        "!CustomElementTwo"
    ];

    TestElementTemplate() {
        /* Tests creating nested HTML-elements */
        console.log("Testing element template");

        // create template from array.  Once create, the template can be rendered multiple times:
        var template = new cbox.Template(this.element_template);

        // render template and catch object ids:
        var props = {};
        var output = template.render(props);

        // dump some debug info
        this.output1.appendChild(output);
        console.log(template);
        console.log(props);

        // assert the template output:
        console.log("Asserting template output");
        this.assertTrue(output != null);

        this.assertEqual(output.tagName, "DIV");
        this.assertEqual(output.children[0].tagName, "UL");
        this.assertEqual((<HTMLElement>output.children[0]).children[0].tagName, "LI");
        this.assertEqual((<HTMLElement>output.children[0]).children[1].textContent, "Butter");
        this.assertEqual(output.children[1].tagName, "P");
        this.assertEqual(output.children[1].getAttribute("class"), "bold");
        this.assertEqual(output.children[1].getAttribute("style"), "font-weight:bold;");

        // assert template object augmentation:
        this.assertTrue(props.hasOwnProperty('mylist'));
        props['myparagraph'].innerHTML = "Changed through props";

    }

    TestDivTemplate() {
        var template = new cbox.Template(this.div_template);
        var output = template.render();
        this.output2.appendChild(output);

        this.assertEqual(output.children[0].tagName, "DIV");
        this.assertEqual((<HTMLElement>output.children[0]).className, "wrapper");
        this.assertEqual((<HTMLElement>output.children[1]).tagName, "DIV");
        this.assertEqual((<HTMLElement>output.children[1]).className, "wrapper");
    }

    TestComponentTemplate() {
        //var template = new cbox.Template(this.component_template);
    }
}



var template_test = new TemplateTest("Template engine");