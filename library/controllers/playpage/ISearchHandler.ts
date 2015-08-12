/**
 * Created by knut on 8/12/2015.
 */

module cbox {

    export interface ISearchHandler {
        title:string;
        resultRoot:HTMLDivElement;
        handleQueryUpdated():HTMLElement;
    }

}