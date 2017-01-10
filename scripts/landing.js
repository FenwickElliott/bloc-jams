var pointsArray = document.getElementsByClassName('point');

var animatePoints = function(p) {

	var revealPoint = function(p){
		p.style.opacity = 1;
		p.style.transform = "scaleX(1) translateY(0)";
		p.style.msTransform = "scaleX(1) translateY(0)";
		p.style.WebkitTransform = "scaleX(1) translate(0)";
	};
	forEach(p, revealPoint)
};

$(window).ready(function(){
	if ($(window).height() > 950){
			animatePoints(pointsArray);
		}
	var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;

	$(window).scroll(function(event){
		if ($(window).scrollTop() >= scrollDistance){
			animatePoints(pointsArray);
		}
	});

});
