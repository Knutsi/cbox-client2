/**
 * Created by knutsi on 24/07/15.
 */

/**
 * Created by knutsi on 23/07/15.
 */

/// <reference path="../runner/resources/unittest.ts" />
/// <reference path="../../library/cboxclient.ts" />

var ln = cbox.logicnode;

/***
 * Example test to demonstrate unittest system.
 */
class LogicNodeTest extends UnitTest.Test {

    TestIsTreatment() {

        var it = new ln.IsTreatment();
        it.ident = "ibuprofen";

        var choice = new cbox.TreatmentChoice(new cbox.Treatment());

        // check match:
        choice.treatment.ident = "ibuprofen";
        it.object = choice;
        this.assertTrue(it.eval());

        // check mismatch:
        choice.treatment.ident = "kattelatte";
        it.object = choice;
        this.assertNotTrue(it.eval());
    }


    TestLogicNode() {

        var A = new ln.LogicNode();
        A.logicType = ln.LogicNode.LOGIC_TYPE_AND;

        var B = new ln.IsTreatment();
        B.ident = "ibuprofen";

        var C = new ln.IsTreatment();
        C.ident = "furosemid";

        A.children.push(B);
        A.children.push(C);

        var choice = new cbox.TreatmentChoice(new cbox.Treatment());
        choice.treatment.ident = "ibuprofen";

        B.object = choice;
        C.object = choice;
        this.assertTrue(B.passes);
        this.assertNotTrue(C.passes);

        /* now, one of the children is positive, the other not - check logic */
        A.object = choice;
        console.log(A);
        A.logicType = ln.LogicNode.LOGIC_TYPE_AND;
        this.assertNotTrue(A.passes);

        A.logicType = ln.LogicNode.LOGIC_TYPE_OR;
        this.assertTrue(A.passes);

        A.logicType = ln.LogicNode.LOGIC_TYPE_N_OF;
        A.n = 1;
        this.assertTrue(A.passes);
        A.n = 2;
        this.assertNotTrue(A.passes);

        A.logicType = ln.LogicNode.LOGIC_TYPE_NOT;
        this.assertNotTrue(A.passes)

        B.ident = "kattelatte 100 mg vesp";
        this.assertTrue(A.passes);
    }


    TestSerializeDeserialize() {

        var A = LogicNodeTest.createTree();
        var choice = new cbox.TreatmentChoice(new cbox.Treatment());
        choice.treatment.ident = "ibuprofen";

        // check that tree works:
        A.logicType = ln.LogicNode.LOGIC_TYPE_OR;
        A.object = choice;
        this.assertTrue(A.passes);
        A.logicType = ln.LogicNode.LOGIC_TYPE_AND;
        this.assertNotTrue(A.passes);

        // serializev
        A.object = null;
        var str = JSON.stringify(A);
        console.log(str);

        //var obj = JSON.parse(str);
        //var A_reanimated = ln.LogicNode.fromObjectInherited(obj);

    }



    static createTree() {
        var A = new ln.LogicNode();
        A.logicType = ln.LogicNode.LOGIC_TYPE_AND;

        var B = new ln.IsTreatment();
        B.ident = "ibuprofen";

        var C = new ln.IsTreatment();
        C.ident = "furosemid";

        A.children.push(B);
        A.children.push(C);

        return A;
    }
}


var logicnode_test = new LogicNodeTest("Logic node list");
