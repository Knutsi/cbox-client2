/**
 * Created by knutsi on 24/07/15.
 */

/**
 * Created by knutsi on 23/07/15.
 */

/// <reference path="../runner/resources/unittest.ts" />
/// <reference path="../../library/cboxclient.ts" />


/***
 * Example test to demonstrate unittest system.
 */
class BindingListTest extends UnitTest.Test {


    TestIterate() {
        var list = new cbox.BindingList<string>(["A", "B", "C"]);
        this.assertEqual(list.length, 3);

        // check that iterator works:
        var found = [];
        list.forEach((item, i) => {
            found[i] = item;
        })

        this.assertEqual(found[0], "A");
        this.assertEqual(found[1], "B");
        this.assertEqual(found[2], "C");
        this.assertEqual(found.length, 3);
    }


    TestEvents() {
        var list = new cbox.BindingList<string>(["A", "B", "C"]);
        this.assertEqual(list.length, 3);

        var add_fired = false;
        var remove_fired = false;

        // check events:
        list.onAdd.subscribe( ((items) => { add_fired = true; } ));
        list.onAdd.subscribe( ((items) => { remove_fired = true; } ));

        this.assertNotTrue(add_fired);
        this.assertNotTrue(remove_fired);

        list.add(["D", "E", "F"]);
        this.assertEqual(list.length, 6);

        list.remove(["D", "F"]);
        this.assertEqual(list.length, 4);

        this.assertTrue(add_fired);
        this.assertTrue(remove_fired);
    }


    TestBasicSelection() {
        var obj1 = { title:"a" };
        var obj2 = { title:"b" };
        var obj3 = { title:"c" };
        var obj4 = { title:"d" };

        // add objects to list with object type:
        var list = new cbox.BindingList<{}>([obj1, obj2, obj4]);
        console.log(list);
        list.add([obj3]);
        list.select(obj3);
        list.select(obj1);

        this.assertEqual(list.selected.length, 2);
        this.assertTrue(list.selected[0] == obj3 || list.selected[0] == obj1)
        this.assertTrue(list.selected[1] == obj3 || list.selected[1] == obj1)
        this.assertTrue(list.selected[0] != list.selected[1]);

        list.deselect(obj1);
        list.deselect(obj3);

        this.assertEqual(list.selected.length, 0);
    }

    TestSelection() {
        // create some test objects:
        var obj1 = { title:"a" };
        var obj2 = { title:"b" };
        var obj3 = { title:"c" };
        var obj4 = { title:"d" };

        // add objects to list with object type:
        var list = new cbox.BindingList<{}>([obj1, obj2, obj4]);
        console.log(list);
        list.add([obj3]);

        // select two, check that it works:
        list.select(obj3);
        list.select(obj1);


        // we know that object three has a higher index than object one, so when we remove two, the
        // index has to shift:
        list.remove([obj2]);
        this.assertEqual(list.selected.length, 2);
        this.assertTrue(list.selected[0] == obj3 || list.selected[0] == obj1)
        this.assertTrue(list.selected[1] == obj3 || list.selected[1] == obj1)
        this.assertTrue(list.selected[0] != list.selected[1]);

        // remove first selected object, check that selection is still correct:
        list.remove([obj1]);
        this.assertEqual(list.selected.length, 1);
        this.assertEqual(list.selected[0], obj3);

        // deselect last item in selection:
        list.deselect(obj3);
        this.assertEqual(list.selected.length, 0);
    }

}


var bindinglist_test = new BindingListTest("Binding list");
