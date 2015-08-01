/**
 * Created by knutsi on 30/07/15.
 */

/// <reference path="../runner/resources/unittest.ts" />
/// <reference path="../../library/cboxclient.ts" />

class TemplateTest extends UnitTest.Test {

    element_template = [
        "ul",
        "-li",
        "--'Bread'",
        "-li",
        "--'Butter'",
        "-li",
        "--'Milk'",
        "p",
        "-'Demo mode!'"
    ]

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
        // create template and render it, then validate the elements it has created:
        var template = new cbox.Template(this.element_template);
        var output = template.render();
        console.log(template);

        this.assertTrue(output != null);

        this.assertEqual(output.tagName, "ul");
        this.assertEqual(output.children[0].tagName, "li");
        this.assertEqual(output.children[3].tagName, "li");
        this.assertEqual(output.children[3].firstChild.textContent, "Bread");
    }

    TestDivTemplate() {
        var template = new cbox.Template(this.div_template);
    }

    TestComponentTemplate() {
        var template = new cbox.Template(this.component_template);
    }
}



var template_test = new TemplateTest("Template engine");