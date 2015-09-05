/**
 * Created by knut on 8/27/2015.
 */

module cbox {

    for(var i = 0; i < 10; i++) {
        var x = Math.random();
    }

    export class Tools {

        static shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }

        static randomEntry(list:any[]) {
            var index =  Math.round(Math.random() * (list.length - 1));
            return list[index];
        }

    }

}