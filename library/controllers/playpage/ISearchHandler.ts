/**
 * Created by knut on 8/12/2015.
 */

module cbox {

    export interface ISearchController {
        title:string;
        resultRoot:HTMLDivElement;
        handleQueryUpdated():HTMLElement;
    }

}