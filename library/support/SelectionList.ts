/**
 * Created by knutsi on 07/08/15.
 */

/// <reference path="BindingList.ts" />

module cbox {

    export class SelectionList<T> extends BindingList<T> {

        selectedIndexes:number[] = [];

        select(items:T[]) {


        }

        add() {
            super.clear();
        }

        clear() {
            super.clear();

        }


    }

}