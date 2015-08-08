/**
 * Created by knut on 8/8/2015.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    export class ElementController {

        root:HTMLDivElement;
        pageController:PageController;

        constructor(root, pc) {
            this.root = root;
            this.pageController = pc;
        }

    }
}