/**
 * Created by knut on 9/2/2015.
 */

module cbox {

    export class LoadArguments {

        public static args:{ [key:string]:string } = {};

        public static add(key:string, value:string) {
            LoadArguments.args[key] = value;
        }

        static get(key:string):string {
            return LoadArguments.args[key];
        }

        static has(key):boolean {
            return LoadArguments.args[key] != null;
        }

        static dump():string {
            var str = "";
            for(var key in LoadArguments.args) {
                str += "\n" + key + " -> " + LoadArguments.args[key];
            }

            return str;
        }
    }


}


// autload arguments when lib loads:
if(window.location.search) {

    var hash_splits = window.location.search.substr(1).split(";");
    if(hash_splits.length > 0) {

        hash_splits.forEach( (arg) => {

            var arg_split = arg.split("=");
            if(arg_split.length == 2)
                cbox.LoadArguments.add(arg_split[0], arg_split[1]);
        })
    }

    console.log(hash_splits.length + " load arguments retrieved: " + cbox.LoadArguments.dump());

} else {
    console.log("No load arguments retrieved");
}