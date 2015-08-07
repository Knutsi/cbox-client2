/**
 * Created by knutsi on 07/08/15.
 */

/// <reference path="Event.ts" />

module cbox {

    /*
    * Array wrapper with events for list changes.
    *
    * */
    export class BindingList<T> {

        items:T[] = [];
        selectedIndexes:number[] = [];

        onChange:Event<GenericEventArgs> = new Event<GenericEventArgs>();
        onAdd:Event<BindingListEventArgs<T>> = new Event<BindingListEventArgs<T>>();
        onRemove:Event<BindingListEventArgs<T>> = new Event<BindingListEventArgs<T>>();


        constructor(items:T[] = []) {
            this.items = items;
        }


        add(items:T[]) {

            items.forEach( (item) => { this.items.push(item) } );

            this.onAdd.fire(new BindingListEventArgs(items));
            this.onChange.fire();
        }


        remove(items:T[]) {
            var removed:T[] = [];

            // find index of each item to remove:
            for(var i in items) {
                var index = this.items.indexOf(items[i]);
                if(index != -1) {

                    // splice the list:
                    var taken = this.items.splice(index,1);
                    taken.forEach((t) => {removed.push(t)} );

                    // was current index removed?
                    var index_in_selection = this.selectedIndexes.indexOf(index);
                    if(index_in_selection != -1)
                        this.selectedIndexes.splice(index_in_selection, 1);
                    this.updateSelectionIndexes(index);
                }
            }

            this.onRemove.fire(new BindingListEventArgs(removed));
            this.onChange.fire();
        }


        clear() {
            this.items = [];
            this.selectedIndexes = [];
            this.onChange.fire();
        }


        forEach(callback) {
            this.items.forEach(callback);
        }


        get length() {
            return this.items.length;
        }


        select(item:T) {
            // get index of item:
            var index = this.items.indexOf(item);

            // if index is in collection and not already selected, we add it:
            if(index != -1 && this.selectedIndexes.indexOf(index) == -1) {
                this.selectedIndexes.push(index);
            }
        }


        deselect(item:T) {
            var item_index = this.items.indexOf(item);
            if(item_index != -1) {
                // item exists, is it selected?
                var selection_index = this.selectedIndexes.indexOf(item_index);
                if(selection_index != -1)
                    this.selectedIndexes.splice(selection_index, 1);
            }
        }


        get selected() {
            return this.selectedIndexes.map( (i) => { return this.items[i] } );
        }


        private updateSelectionIndexes(deleted_index:number) {
            /* When an element is deleted, indexes at higher numbers shift down by one, so we
            need to subtract from those indexes */

            var delete_at = -1;
            for(var i in this.selectedIndexes) {
                if(this.selectedIndexes[i] > deleted_index) {

                    // higher indexes are shifted down one:
                    this.selectedIndexes[i] -= 1;

                }
            }
        }
    }


    export class BindingListEventArgs<T> {

        items:T[] = [];

        constructor(items:T[]) {
            this.items = items;
        }

    }

}