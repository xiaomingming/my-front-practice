$.fn.simplePlaceholder = function() {
	$(this).each(function() {
		var a = $(this);
		a.focus(function() {
			if ($.trim(a.val()) === a.attr("placeholder")) {
				a.removeClass("placeholder").val("")
			}
		}).blur(function() {
			if ($.trim(a.val()) === "") {
				a.addClass("placeholder").val(a.attr("placeholder"))
			}
		});
		if (!$.trim(a.val()) || a.val() === $.trim(a.attr("placeholder"))) {
			a.addClass("placeholder").val(a.attr("placeholder"))
		}
	})
};