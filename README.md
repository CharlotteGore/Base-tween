# Base Tween

Base tween is the low level successor to Orbit. It is a platform/framework neutral way of creating very smooth animations without CSS3.

Given a start and end value, a duration and an easing type, Tween generates the values inbetween for each moment in time during the animation.

When you `play()` a tween, your `onTick()` callback is called. It is passed the appropriate tween value for that particular time.  

## Features

- Low level, framework / DOM neutral.
- Async onTick() callback. You decide what happens with the calculated tween value.
- Ultra slinky bezier curve based easing: deceleration, acceleration, 'bubble' and linear. 
- Async onComplete() callback. 
- Frame skipping / Progressive enhancement. Animations last the duration specified, but get smoother as the browser allows.
- Full cross-browser support.
- Uses requestAnimationFrame where supported
- User-configured target FPS for non requestAnimationFrame browsers

## Installing

	<script type="text/javascript" src="/lib/base/base.js"></script>
	<script type="text/javascript" src="/tween.js"></script>

## Using

var myElement = $('#some-element'); //

	var animation = base.tween({
	
		start : 0, // your start value
		end : 100, // the end value
		fps : 100, // target max FPS for non requestAnimationFrame browsers.
		duration: 1000, // the animation length, in miliseconds
		easing : 'accelerate', // 'accelerate' || 'decelerate' || 'bubble' || 'linear'
		onComplete : function(){  // a callback to be executed when the animation is complete. 
			// do something
		},
		onTick : function(tween){ 
			// this function is called every 'tick'. 
			myElement.css({ left : tween }); // in this example, myElement's .style.left is updated.  
		}

	})

animation.play(); // run the animation. In this example, #some-element would move horizontally 100px. 