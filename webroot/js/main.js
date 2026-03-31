$(function(){
	var $main = $("#main"),
		$window = $( window ),
		$windowControls = $("#window-controls"),
		dashboardActive = $("#dashboard-grid").length > 0,
		configuredAspect = apperanceSettings.aspectRatio,
	    mainHeight = $main.outerHeight(),
	    mainWidth = $main.outerWidth(),
	    mainAspect = dashboardActive ? (mainWidth / mainHeight) : configuredAspect,
	    resizeTimer;

		if (dashboardActive) {
			$('body').css("transform", "")
		} else if (configuredAspect == 4/3) {
			$('body').css("transform", "scale(88.88%, 100%)")
		} else {
			$('body').css("transform", "")
		}

//calls rescale when window resizes
	$(window).resize( function(e) {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			mainHeight = $main.outerHeight();
			mainWidth = $main.outerWidth();
			mainAspect = dashboardActive ? (mainWidth / mainHeight) : configuredAspect;
			scaleWindow();
		}, 100);
	});

	function getActiveStageRect() {
		var stageSelectors = ["#main", "#startup", "#settingspanel"];
		var activeStage = stageSelectors
			.map(function(selector) { return $(selector); })
			.find(function($stage) { return $stage.length && $stage.is(":visible"); });

		if (!activeStage || !activeStage.length) {
			return null;
		}

		return activeStage[0].getBoundingClientRect();
	}

	function syncWindowControls() {
		var activeStageRect = getActiveStageRect();

		if (!$windowControls.length || !activeStageRect) {
			return;
		}

		$windowControls.css({
			right: Math.max(10, window.innerWidth - activeStageRect.right + 10) + "px",
			bottom: Math.max(10, window.innerHeight - activeStageRect.bottom + 10) + "px"
		});
	}

	function observeStageChanges() {
		if (typeof MutationObserver === "undefined") {
			return;
		}

		var stageSelectors = ["#main", "#startup", "#settingspanel"];
		var observer = new MutationObserver(function() {
			window.requestAnimationFrame(syncWindowControls);
		});

		stageSelectors.forEach(function(selector) {
			var stage = document.querySelector(selector);
			if (stage) {
				observer.observe(stage, {
					attributes: true,
					attributeFilter: ["style", "class"]
				});
			}
		});
	}

	function scaleWindow() {
		var scale, windowAspect;

		windowAspect = $window.width() / $window.height();
		if (windowAspect>=mainAspect) {
			scale = $window.height() / mainHeight;
		} else {
			scale = $window.width() / mainWidth;
		}

		$main.css({
			transform: "translate(-50%, -50%) " + "scale(" + scale + ")"
		});
		$("#startup").css({
			transform: "translate(-50%, -50%) " + "scale(" + scale + ")"
		});
		$("#settingspanel").css({
			transform: "translate(-50%, -50%) " + "scale(" + scale + ")"
		});
		syncWindowControls();
	}
	scaleWindow(); // init
	observeStageChanges();

});
