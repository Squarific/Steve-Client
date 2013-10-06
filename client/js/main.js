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
		console.log(change);
        $(".tab.active").addClass("changed");
    })

    editor.on("cursorActivity", function (doc) {
        // had a function which didn't work ...
        console.log(doc.getDoc().sel.anchor.line);
    });
	
	var tabs = {};
	
	tabs.assureNumbered = function (tabs) {
		if (!tabs || typeof tabs.length !== "number") {
			throw "No tab list given";
		}
		for (var key = 0; key < tabs.length; key++) {
			if (typeof tabs[key].number === "number") {
				if (!this.numberNotUsedTwice(tabs, tabs[key].number)) {
					tabs[key].number = this.lastNotUsedNumber(tabs);
				}
			} else {
				tabs[key].number = this.lastNotUsedNumber(tabs);
			}
		}
	};
	
	tabs.setOrderedLeft = function (tabs) {
		if (!tabs || typeof tabs.length !== "number") {
			throw "No tab list given";
		}
		this.assureNumbered(tabs);
		for (var key = 0; key < tabs.length; key++) {
			if (tabs[key].dragging) {
				continue;
			}
			tabs[key].style.position = "absolute";
			$(tabs[key]).stop(true).animate({left: this.leftOffsetOf(tabs, tabs[key].number) + 200 + "px"}, {queu: false}); //Logo = 200
		}
	};
	
	tabs.tabBefore = function (tabs, number) {
		var highest;
		if (!tabs || typeof tabs.length !== "number") {
			throw "No tab list given";
		}
		for (var key = 0; key < tabs.length; key++) {
			if ((!highest || highest.number < tabs[key].number) && tabs[key].number < number) {
				highest = tabs[key];
			}
		}
		return highest;
	};
	
	tabs.tabBehind = function (tabs, number) {
		var lowest;
		if (!tabs || typeof tabs.length !== "number") {
			throw "No tab list given";
		}
		for (var key = 0; key < tabs.length; key++) {
			if ((!lowest || lowest.number > tabs[key].number) && tabs[key].number > number) {
				lowest = tabs[key];
			}
		}
		return lowest;
	};
	
	tabs.numberNotUsedTwice = function (tabs, number) {
		var used = false;
		if (!tabs || typeof tabs.length !== "number") {
			throw "No tab list given";
		}
		for (var key = 0; key < tabs.length; key++) {
			if (tabs[key].number === number) {
				if (used) {
					return false;
				}
				used = true;
			}
		}
		return true;
	};
	
	tabs.lastNotUsedNumber = function (tabs) {
		var number = 0;
		if (!tabs || typeof tabs.length !== "number") {
			throw "No tab list given";
		}
		for (var key = 0; key < tabs.length; key++) {
			if (tabs[key].number >= number) {
				number = tabs[key].number + 1;
			}
		}
		return number;
	};
	
	tabs.leftOffsetOf = function (tabs, number) {
		var offset = 0;
		if (!tabs || typeof tabs.length !== "number") {
			throw "No tab list given";
		}
		for (var key = 0; key < tabs.length; key++) {
			if (tabs[key].number < number) {
				offset += tabs[key].offsetWidth;
			}
		}
		return offset;
	};
	
    $(".tab").draggable({
        axis: "x",
		start: function (e, ui) {
			var tabs = ui.helper[0].parentNode.children;
			ui.helper[0].dragging = true;
			this.assureNumbered(tabs);
			this.setOrderedLeft(tabs);
		}.bind(tabs),
        stop: function (e, ui) {
			var tabs = ui.helper[0].parentNode.children;
			ui.helper[0].dragging = false;
			this.assureNumbered(tabs);
			this.setOrderedLeft(tabs);
        }.bind(tabs),
        drag: function (e, ui) {
			var tabs = ui.helper[0].parentNode.children,
				before = this.tabBefore(tabs, ui.helper[0].number),
				behind = this.tabBehind(tabs, ui.helper[0].number);
			if (before && this.leftOffsetOf(tabs, before.number) + 200 + before.offsetWidth / 3 > parseInt(ui.helper[0].style.left)) { //200 = LOGO
				ui.helper[0].number = before.number;
				before.number = ui.helper[0].number + 1;
				this.setOrderedLeft(tabs);
			} else if (behind && this.leftOffsetOf(tabs, behind.number) + 200 - behind.offsetWidth / 3 < parseInt(ui.helper[0].style.left)) { //200 = LOGO
				behind.number = ui.helper[0].number;
				ui.helper[0].number = behind.number + 1;
				this.setOrderedLeft(tabs);
			}
		}.bind(tabs)
    });

	tabs.assureNumbered($(".tab"));
	tabs.setOrderedLeft($(".tab"));
	
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