/**
 * Created by knut on 8/8/2015.
 */

/// <reference path="../../cboxclient.ts" />


module cbox {

    export class ScreenView extends ElementController{

        screen:Screen;

        constructor(root:HTMLDivElement, pc:PlayPageController) {
            super(root, pc);

            // screen view register with page controller:
            this.screen = new Screen(root.id, root.id, root);
            pc.screenManager.register(this.screen);
        }

    }

    MVC.registerElementController("ScreenView", ScreenView);
}