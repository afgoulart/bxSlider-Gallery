(function(){
	// ======================= imagesLoaded Plugin ===============================
	// https://github.com/desandro/imagesloaded

	// $('#my-container').imagesLoaded(myFunction)
	// execute a callback when all images have loaded.
	// needed because .load() doesn't work on cached images

	// callback function gets image collection as argument
	//  this is the container

	// original: mit license. paul irish. 2010.
	// contributors: Oren Solomianik, David DeSandro, Yiannis Chatzikonstantinou

	$.fn.imagesLoaded = function( callback ) {
		var $images = this.find('img'),
			len = $images.length,
			_this = this,
			blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

		function triggerCallback() {
			callback.call( _this, $images );
		}

		function imgLoaded() {
			if ( --len <= 0 && this.src !== blank ){
				setTimeout( triggerCallback );
				$images.unbind( 'load error', imgLoaded );
			}
		}

		if ( !len ) {
			triggerCallback();
		}

		$images.bind( 'load error',  imgLoaded ).each( function() {
			// cached images don't fire load sometimes, so we reset src.
			if (this.complete || this.complete === undefined){
				var src = this.src;
				// webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
				// data uri bypasses webkit log warning (thx doug jones)
				this.src = blank;
				this.src = src;
			}
		});

		return this;
	};

})(jQuery)

function togglePainels(speedAction, force_show, $parents, $elPanels){
	if(!$elPanels){
		var $elPanels = $parents.find('.PanelGaleria');
	}
	$elPanels.each(function(){
		var $this = $(this);
		var direction = $this.data('direction-hide');
		var elHide = $this.data('element-hide');
		var height = $this.height();
		var width = $this.width();
		if(elHide && !force_show){
			switch(direction){
				case 'top':
					$this.stop().animate({top: (height*(-1))},speedAction);
					break;
				case 'bottom':
					$this.stop().animate({bottom: (height*(-1))},speedAction);
					break;
				case 'right':
					$this.stop().animate({right: (width*(-1))},speedAction);
					break;
				case 'left':
					$this.stop().animate({left: (width*(-1))},speedAction);
					break;
			}
			$this.data('element-hide',false);
		}else{
			switch(direction){
				case 'top':
					$this.stop().animate({top: 0},speedAction);
					break;
				case 'bottom':
					$this.stop().animate({bottom: 0},speedAction);
					break;
				case 'right':
					$this.stop().animate({right: 0},speedAction);
					break;
				case 'left':
					$this.stop().animate({left: 0},speedAction);
					break;
			}
			$this.data('element-hide',true);
		}
	});
}

function createSlide($slideContent){
	var is_touch_device = 'ontouchstart' in document;
	return $slideContent.bxSlider({
		pager: false,
		adaptiveHeight: true,
		prevText:'<span class="bullet"></span>',
		nextText:'<span class="bullet"></span>',
		touchEnabled: is_touch_device,
		onSliderLoad: function(currentIndex){
			$slideContent.find('li:eq('+(currentIndex+1)+')').addClass('item-current');
		},
		onSlideBefore:function($slideElement, oldIndex, newIndex){
			$slideElement.parent().find('li:eq('+(oldIndex+1)+')').removeClass('item-current');
		},
		onSlideAfter: function($slideElement, oldIndex, newIndex){
			$slideElement.addClass('item-current');
		}
	});
}

function Galeriabuild(){
	var delayExecution = (function(){
		var timeoutId = 0;
		return function(callback, ms){
			clearTimeout (timeoutId);
			timeoutId = setTimeout(callback, ms);
		};
	})();

	var $galleryContent = $(".box-gallery");
		
	$galleryContent.each(function(){
		var $this = $(this),
			$slideContent = $this.find(".bx-slider");
		window[$this.attr('id')] = createSlide($slideContent);

		$this.find('img').on('click.togglePainels', function(){
			togglePainels('slow', false, $this);
		});
	});
	
	$(".bx-next").data('direction-hide', 'right')
	$(".bx-prev").data('direction-hide', 'left');
	$(".headerTitleGallery").data('direction-hide', 'top');
	$(".infosBottom").data('direction-hide', 'bottom');
	$(".infosBottom, .headerTitleGallery, .bx-prev, .bx-next").data('element-hide',true).addClass('PanelGaleria');

	$galleryContent.imagesLoaded( function() {});
	
	$(".changeGallery a").on('click.changeGallery',function(e){
		e.preventDefault();
		var $link = $(this);
		var idGallery = $link.data('target');
		var $currentGallery = $('.box-gallery:visible');

		if($currentGallery.attr('id') == idGallery && $currentGallery.size() == 1) return false;
		
		var $gallery = $('#'+idGallery);
		togglePainels('slow', true, $gallery);

		$currentGallery.fadeOut(200,function(){
			$(this).hide();
			$(".changeGallery .gallery").removeClass('active');
			$gallery.fadeIn(200, function(){
				$link.parent().addClass('active');
			});
		});

		return false;
	})

	$(".changeGallery a").first().trigger('click');
};



$(document).ready(function(){
	Galeriabuild();
	/*$('.bx-slider li').each(function(){
		$(this).on({
			'mouseenter.showPainelsGaleria':function(){
				$(this).hidePainels();
			},
			'mouseleave.showPainelsGaleria': function (){
				$(this).showPainels();
			},
			'mousemove.showPainelsGaleria': function() {
			}
		});
	});

	delayExecution(function(){
		$('.box-gallery.active .bx-slider li:eq(1)').hidePainels();
	},1000);*/
});