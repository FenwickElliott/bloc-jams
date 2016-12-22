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



window.onload = function() {
	if (window.innerHeight> 950 ){
		animatePoints(pointsArray);
	}	
		
	var sellingPoints = document.getElementsByClassName('selling-points')[0];
	var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
	
	window.addEventListener('scroll', function(event){
		if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
             animatePoints(pointsArray);   
         }
	});
}