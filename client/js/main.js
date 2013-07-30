$(document).ready(function () {

    $(".startup").fadeOut(300, function () { $(this).remove() });

    var modal = function (type, html) {
        $modal = $(".modal");
        if($modal.hasClass("visuallyhidden")) {
            $modal.html(html).attr("data-type", type).hide().removeClass("visuallyhidden").css({"left" : $("body").width() / 2 - $modal.outerWidth() / 2}).slideDown(300);

            return true;
        }

        return false;
    }

   // modal("success", "<h3>You have to login!</h3><input type='text'/><input type='password' />");

    var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        theme: "tomorrow-night-eighties",
    })

    editor.on("change", function (instance, change) {
        $(".tab.active").addClass("changed");
    })

    editor.on("cursorActivity", function (doc) {
        // had a function which didn't work ...
        console.log(doc.getDoc().sel.anchor.line);
    });

    var tabs, tab, jj = -1, i, $moved, t, o, tab1;
    $(".tab").draggable({ 
        axis: "x",
        start: function (e, ui) {
            tab = ui.helper;
            tabs = [];
            i = 0;
            $(".tabs").find(".tab").each(function () {
                if(tab[0] != this) {
                    tabs.push($(this));
                    i+= 1;
                } else {
                    if(jj == -1)
                        jj = i;
                }
            });
            tabs.sort(function (a, b) { return a.offset().left - b.offset().left });
        },
        stop: function (e, ui) {
            $moved = [];
            jj = -1;

            if($(".moved-right").length) {
                $($(".moved-right")[0]).before(tab);
            } else if($(".moved-left").length) {
                t = $(".moved-left");
                $(t[t.length-1]).after(tab);
            }
            $(".tabs").find(".tab").stop().css({"left" : "0"}).removeClass("moved-right").removeClass("moved-left");
        },
        drag: function (e, ui) {
            o = ui.originalPosition.left + ui.offset.left;

            if(ui.position.left < 0) {
                for (var i = jj-1; i >= 0; i--) {
                    tab1 = tabs[i];
                    if(o < tab1.offset().left + tab1.outerWidth() / 2 && !tab1.hasClass("moved-right")) {
                        tab1.animate({"left" : tab.outerWidth() }, 300).addClass("moved-right");
                    }
                }
            } else {
                for (var i = jj; i < tabs.length; i++) {
                    tab1 = tabs[i];
                    if(o > tab1.offset().left - tab1.outerWidth() / 2  && !tab1.hasClass("moved-left")) {
                        tab1.animate({"left" : -tab.outerWidth() }, 300).addClass("moved-left");
                    }
                }
            }
        }
    });

    $(".settings").on("mouseenter", ".option", function () {
        $(this).toggleClass("active");
        $(" > div", this).stop().fadeIn(150);
    }).on("mouseleave", ".option", function () {
         $(this).toggleClass("active");
        $(" > div", this).stop().fadeOut(150);
    });

    $(".sidebar").on("click", "li", function (e) {
        e.stopPropagation(); // prevent parental lists to be triggered

        switch($(this).attr("data-type")) {
            case "folder":
                $(this).attr("data-type", "open").children("ul").stop().slideDown(300);
                break;

            case "open":
                $(this).attr("data-type", "folder").children("ul").stop().slideUp(300);
                break;

            case "file":
                // TODO
                // handle fileopen
                break;
        }
    });

   // $(".additionalview").css({"height" : 300}).slideDown(300);
   // $(".content").animate({"bottom" : 300}, 300);

    var pending = function (enable, callback) {
        $d = $(".steve div");
        $s = $(".steve span");
        $i = $(".steve img");
        
        if(enable) {
            $d.stop().animate({"width" : 29}, 800);
            $s.stop().fadeOut(500, function () { $i.stop().fadeIn(300, callback) });
        } else {
            $d.stop().animate({"width" : $s.width()}, 800);
            $i.stop().fadeOut(500, function () { $s.stop().fadeIn(300, callback) });
        }
    };

    pending(true, function () {
        setTimeout(function() {
             pending(false);
        }, 4000);
    });

});