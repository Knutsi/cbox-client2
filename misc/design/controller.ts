/**
 * Created by knutsi on 04/08/15.
 */

/// <reference path="../../library/cboxclient.ts" />


var manager = new cbox.ScreenManager();
var screens_divs = document.querySelectorAll(".screen");

for(var i in screens_divs){
    var screen_root = screens_divs[i];
    if(screen_root.attributes) {
        var screen_id = screen_root.attributes['id'].value;
        var screen_obj = new cbox.Screen(screen_id, screen_id, <HTMLDivElement>document.querySelector("#" + screen_id));
        manager.register(screen_obj);


        // add to debug:
        var debug = <HTMLElement>document.querySelector("#screenlist");
        var li = document.createElement("li");
        debug.appendChild(li);

        var debug_link = document.createElement("a");
        debug_link.href = "#" + screen_id;
        debug_link.textContent = screen_id;
        li.appendChild(debug_link);
    }
}


window.onhashchange = () => {
    manager.activate(window.location.hash.substr(1));
}

document.body.onload = () => {
    manager.activate(window.location.hash.substr(1));
}
