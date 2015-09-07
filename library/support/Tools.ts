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

        static millisecondsToTimeString(time_ms:number):string {
            // calculate time spent:
            var t = time_ms/1000;
            var seconds = Math.floor(t % 60);
            t /= 60;
            var minutes = Math.floor(t % 60);
            t /= 60;
            var hours = Math.floor(t % 24);
            t /= 24;
            var days = Math.floor(t);

            var leading_0_seconds = "";
            if(seconds < 10)
                leading_0_seconds = "0";

            return days + ":" + hours + ":" + minutes + ":" + leading_0_seconds + seconds;
        }

    }

}