/**
 * Created by knutsi on 30/07/15.
 */

/// <reference path="../runner/resources/unittest.ts" />
/// <reference path="../../library/cboxclient.ts" />

class TemplateTest extends UnitTest.Test {

    element_template = "// demo: html elements and : \
ul \
    li \
        Cheese \
    li \
        Jam \
    li \
        Milk \
    li\
        Bread\
";

    TestElementTemplate() {
        // create template and render it, then validate the elements it has created:
        var template = new cbox.Template(this.element_template);
        var output = template.render();

        this.assertTrue(output != null);

        this.assertEqual(output.tagName, "ul");
        this.assertEqual(output.children[0].tagName, "li");
        this.assertEqual(output.children[3].tagName, "li");
        this.assertEqual(output.children[3].firstChild.textContent, "Bread");
    }
}



var template_test = new TemplateTest("Template engine");