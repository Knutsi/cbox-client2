/**
 * Created by knut on 8/8/2015.
 */

/// <reference path="../../cboxclient.ts" />


module cbox {

    export class ScreenView extends ElementController{

        constructor(root:HTMLDivElement, pc:PlayPageController) {
            super(root, pc);

            // screen view register with page controller:
            var screen = new Screen(root.id, root.id, root);
            pc.screenManager.register(screen);
        }

    }

    MVC.registerElementController("ScreenView", ScreenView);
}