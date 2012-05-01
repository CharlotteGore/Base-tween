/********************************************************************
*
* Filename:		Tween.js
* Description:	Tween generator and animation subsystem
* Author:		Charlotte Gore 
*	
********************************************************************/
(function(base){

	if(typeof base==='undefined'){

		throw('No window.base()');

	}

	var tween = base.createChild()	
	
	tween.addInstanceMethods({
	
		init : function(){
	
			// some private functions hidden in the closure for the amusement 
			// of the initialiser. These do the donkey work of generating the 
			// tween cache.

			var bezierPresets = {
				// this object contains functions which turn a start value and end value into a set of 4 bezier points
				// which, ultimately, define the behaviour of the animation
				 
				decelerate: function (start, end)  {
					return {p1: end, p2: end, p3: end, p4: start};
				},
				accelerate: function (start, end)  { 
					return {p1: end, p2: start, p3: start, p4: start};
				},
				bubble: function (start, end)  { 
					return {p1: end, p2: end, p3: start, p4: start}; 
				},
				linear: function ()  {
					return false;
				}

			};

			var bezier = {
				// Bezier Mathemetics calculator functions. See http://en.wikipedia.org/wiki/B%C3%A9zier_curve
				B1: function (t)  { 
					return (t * t * t); 
				},		
				B2: function (t)  { 
					return (3 * t * t * (1 - t)); 
				},		
				B3: function (t)  { 
					return (3 * t * (1 - t) * (1 - t)); 
				},		
				B4: function (t)  { 
					return ((1 - t) * (1 - t) * (1 - t)); 
				}

			};

			var getValueByPercent = function( percent, curve ){
				// Using bezier maths, get the computed value of a point at n percent along the path
				
				var value = 0;
				// Voodoo Bezier curve mathematics.
				value = curve.p1 * bezier.B1(percent) + curve.p2 * bezier.B2(percent) + curve.p3 * bezier.B3(percent) + curve.p4 * bezier.B4(percent);
				
				return value;
			
			};

			var tweenGenerator = function ( obj )  {

				var frameData = [];

				var curve;

				var index = 0;

				try{
					// see if a valid easing has been set
					curve = bezierPresets[obj.easing](obj.start, obj.end);
				
				}catch(e){

					curve = false;

				}

				if (!curve) {
					// linear curve - identical increments between start and end
					// along the curve.
					difference = obj.end - obj.start;
					
					if(difference){		
						// set index to the number of frames + 1
						index = (obj.frames + 1);
						// then working backwards, efficient like...
						while(index--){
							// calculate the value for each frame at each increment
							frameData[index] = obj.start + ((difference * index) / obj.frames);
						
						}
					}else{
						// create one frame. Start and End are the same.
						frameData[0] = obj.start;
					}
								
					
				} else {
					// ... else we've got an eased tween
				
					// set index to the number of frames + 1
					index = (obj.frames + 1);
					// then working backwards...
					while(index--){
						// we invoke one of the helpers to calculate the value for that 
						frameData[index] = Math.round(getValueByPercent((index / obj.frames), curve));
					}
							
				}
				// return the calculated frames.
				return frameData;
		
			};	
			
			// Now that we have those functions helpfully squished into memory, we 
			// now return the initaliser function, which will have access to all
			// the above functions. Neato!
			
			return function( config ){

				var self = this;

				self.config = {	
					start: 0,
					end : 100,
					duration: 1000, // in miliseconds
					easing : "decelerate",
					onTick : function(){},
					onComplete : function(){},
					fps : 25 // a tick every 40ms is equivilant to 25fps
				};

				// create a callback function, with "this" inside the closure
				if(typeof window.requestAnimationFrame !== 'undefined'){

					self.stepper = function(){
						requestAnimationFrame(function(){

							self.step();

						});						
					};


				}else if(typeof window.webkitRequestAnimationFrame !== 'undefined'){

					self.stepper = function(){
						webkitRequestAnimationFrame(function(){

							self.step();

						});						
					};

				}else if(typeof window.mozRequestAnimationFrame !== 'undefined'){


					self.stepper = function(){
						mozRequestAnimationFrame(function(){

							self.step();

						});						
					};

				}else{

					self.stepper = function(){

						setTimeout(function(){

							self.step();

						}, self.tickDuration);

					};

				}
				// update config based on user input
				base.extend(self.config, config );

				self.tickDuration = 1000 / self.config.fps;

				// calculate the number of frames, rounding up.
				this.config.frames = Math.ceil(self.config.duration / self.tickDuration);
				// we tweak the duration so that it's still compatible with the number of ticks..
				this.duration = Math.ceil(self.config.duration / self.config.frames);

				this.cache = tweenGenerator( self.config );

				return this;

			};

		}(),
		
				// methods
		play : function(){
			// begin the animation
			this.startTime = (new Date()).getTime();

			this.stop = false;

			this.stepper();

			return this;

		},

		stop : function(){

			this.stop = true;

			return this;

		},

		step : function(){

			// step needs this helper function. It's hidden inside a closure.
			var getCurrentFrame = function(){

				//var dateObj = new Date(),
					var elapsedTime = (new Date()).getTime() - this.startTime;
					
					var frame = Math.ceil(elapsedTime / this.duration);

					if (frame > this.config.frames) {
						frame = this.config.frames;
					}
					return frame;
					

			};
			
			// then we return the actual step method, which has access to getCurrentFrame

			return function(){

				// get the current frame. We use .call so that getCurrentFrame has the tween object as its scope
				var frame = getCurrentFrame.call(this);
				
				// we pass the frame value to the callback function.
				this.config.onTick(this.cache[frame]);
				
				if(!this.stop){
				// if there's still more frames to go...
					if (frame < this.config.frames) {
						// we set a timeout for the stepper to trigger the next frame.
						this.stepper();

					}else{
						
						this.config.onComplete();
							
					}

				}

			};

		}()	
	
	});

	base.addStaticProperties({

		tween : tween

	});
	
}(base));