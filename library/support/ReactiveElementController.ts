/**
 * Created by knut on 8/5/2015.
 */

/// <reference path="../cboxclient.ts" />

module cbox {

    /**
     * Root class designed for elements that react to game events and state
     * changes to update their rendering.
     *
     * The elements are required to provide a root div to render from.
     *
     * Also provides a utility function to get elements by role name (the 'data-cbox-role' attribute).
     * */
    export class ReactiveElementController {

        root:HTMLDivElement;
        game:GameClient;

        constructor(root:HTMLDivElement, game:GameClient) {

            this.root = root;
            this.game = game;
        }

        element(role:string):HTMLElement {
            return <HTMLElement>this.root.querySelector("[data-cbox-role=\"" + role + "\"]");
        }

    }


}