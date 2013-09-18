var gallerySliders = {};
(function(){
	Gallerybuild = function(opt){
		if(!opt) var opt = {};

		settings = {
			classPanelGallery: 'PanelGallery',
			seletorsPanelGalley: '.infosBottom, .headerTitleGallery, .bx-prev, .bx-next',
			seletorHeader: '.headerTitleGallery',
			seletorFooter: '.infosBottom',
			seletorNext: '.bx-next',
			seletorPrev: '.bx-prev',
			seletorGallery: '.box-gallery',
			seletorGlobalGallery: '#galeria',
			seletorParentGallery: '.galleryViewPort',
			seletorChangeGallery: '.changeGallery',
			seletorChangeGalleryContentLink: '.gallery',
			keybordControls: true,
			optionsBxSlider: {

			}
		};

		$.extend(settings, opt);

		var $allGalleries = $(settings.seletorGallery);
		
		if(!$allGalleries.size()) return false;
		
		$allGalleries.css('visibility', 'hidden');

		//TODO :: ajustar esse trecho
		var $galleryContent = $allGalleries.eq(0);

		$slideContent = $galleryContent.find(".bx-slider");

		$(settings.seletorChangeGallery + " a").on('click.changeGallery',function(e){
			e.preventDefault();
			var $link = $(this);
			var idGallery = $link.data('target');
			var $currentGallery = $(settings.seletorGallery + ':visible');

			if($currentGallery.attr('id') == idGallery && $currentGallery.size() == 1) return false;

			var $gallery = $('#'+idGallery);
			$gallery.togglePainels('slow', true);

			$currentGallery.fadeOut(200,function(){
				$(settings.seletorChangeGallery + " " + settings.seletorChangeGalleryContentLink).removeClass('active');

				if(!$gallery.find('.bx-slider').data('galleryLoaded')){
					$gallery.css('visibility', 'hidden');
					$gallery.find('.bx-slider').createSlide(idGallery);
					$gallery.find(settings.seletorsPanelGalley).data('element-hide',true).addClass(settings.classPanelGallery);
				}

				$gallery.fadeIn(200, function(){
					$gallery.css('visibility', 'visible');
					$link.parent().addClass('active');
				});
			});

			return false;
		});

		if(settings.keybordControls){
			$(window).on({
				keyup: function(event){
					var $currentGallery = $(settings.seletorGallery + ':visible');
					if(event.which == 37){ //PREV
						$currentGallery.find('.bx-prev').trigger('click');
					}
					if(event.which == 39){ //NEXT
						$currentGallery.find('.bx-next').trigger('click');
					}
					
					if(event.which == 38){ //PREV GALLERY
						$currentGallery.changeGalleryKeybord('prev');
					}
					
					if(event.which == 40){ //NEXT GALLERY
						$currentGallery.changeGalleryKeybord('next');
					}
				},
				keydown: function(){

					if(event.which == 38){ //PREV GALLERY
						event.preventDefault();
					}
					
					if(event.which == 40){ //NEXT GALLERY
						event.preventDefault();
					}	
				}
			});
		}

		$(settings.seletorChangeGallery + " a").first().trigger('click');
	};



	$.fn.id = function(){
		return this.attr('id');
	};

	$.fn.changeGalleryKeybord = function(direction){
		var id = this.id();
		switch(direction){
			case "prev":
				$(settings.seletorChangeGallery + ' a[data-target="' + id + '"]').parent().prev().find('a').trigger('click');
				break;
			case "next":
				$(settings.seletorChangeGallery + ' a[data-target="' + id + '"]').parent().next().find('a').trigger('click');
				break;
		}
	};

	$.fn.togglePainels = function(speedAction, force_show, $elPanels){
		if(!speedAction) speedAction = 1000;
		if(!force_show) force_show = false;
		if(!$elPanels) $elPanels = this.find('.'+settings.classPanelGallery);
	
		$elPanels.each(function(){
			var $this = $(this);
			var direction = $this.data('direction-hide');
			var elHide = $this.data('element-hide');
			var height = $this.height();
			var width = $this.width();
			var checkCSSTransition = $('html').hasClass('csstransitions');
			if(elHide && !force_show){
				switch(direction){
					case 'top':
						if (checkCSSTransition) {
							$this.css({top: (height*(-1))});
						}else{
							$this.stop().animate({top: (height*(-1))},speedAction);
						}
						break;
					case 'bottom':
						if (checkCSSTransition) {
							$this.css({bottom: (height*(-1))});
						}else{
							$this.stop().animate({bottom: (height*(-1))},speedAction);
						}
						break;
					case 'right':
						if (checkCSSTransition) {
							$this.css({right: (width*(-1))});
						}else{
							$this.stop().animate({right: (width*(-1))},speedAction);
						}
						break;
					case 'left':
						if (checkCSSTransition) {
							$this.css({left: (width*(-1))});
						}else{
							$this.stop().animate({left: (width*(-1))},speedAction);
						}
						break;
				}
				$this.data('element-hide',false);
			}else{
				switch(direction){
					case 'top':
						if (checkCSSTransition) {
							$this.css({top: 0});
						}else{
							$this.stop().animate({top: 0}, speedAction);
						}
						break;
					case 'bottom':
						if (checkCSSTransition) {
							$this.css({bottom: 0});
						}else{
							$this.stop().animate({bottom: 0}, speedAction);
						}
						break;
					case 'right':
						if (checkCSSTransition) {
							$this.css({right: 0});
						}else{
							$this.stop().animate({right: 0}, speedAction);
						}
						break;
					case 'left':
						if (checkCSSTransition) {
							$this.css({left: 0});
						}else{
							$this.stop().animate({left: 0}, speedAction);
						}
						break;
				}
				$this.data('element-hide',true);
			}
		});
		return this;
	};
	
	$.fn.createSlide = function(idGallery){
		console.log('settings.seletorGallery',settings.seletorGallery);
		var $galleryContent = $(idGallery);
		var idGallery = $galleryContent.id();
		this.data('galleryLoaded', true);
		if(settings.optionsBxSlider.onSliderLoad)
			var defaultOnSliderLoad = settings.optionsBxSlider.onSliderLoad;
		else
			var defaultOnSliderLoad = function(){};

		settings.optionsBxSlider.onSliderLoad = function(currentIndex){
			defaultOnSliderLoad(currentIndex);
			$slideContent.find('li:eq('+(currentIndex+1)+')').addClass('item-current');

			$galleryContent.find(settings.seletorNext).data('direction-hide', 'right');
			$galleryContent.find(settings.seletorPrev).data('direction-hide', 'left');
			$galleryContent.find(settings.seletorHeader).data('direction-hide', 'top');
			$galleryContent.find(settings.seletorFooter).data('direction-hide', 'bottom');
			$galleryContent.find(settings.seletorsPanelGalley).data('element-hide', true).addClass(settings.classPanelGallery);
			$galleryContent.on('click.togglePainels', 'img', function(){
				$galleryContent.togglePainels('slow', false);
			});

			if(settings.callback && settings.callback.onSliderLoad)
				settings.callback.onSliderLoad();
		}

		gallerySliders[idGallery] = this.bxSlider(settings.optionsBxSlider);

		return gallerySliders[idGallery];
	};

	var createThumbs = function(){};

})(jQuery)

var delayExecution = (function(){
	var timeoutId = 0;
	return function(callback, ms){
		clearTimeout (timeoutId);
		timeoutId = setTimeout(callback, ms);
	};
})();

$(document).ready(function($) {
	var is_touch_device = 'ontouchstart' in document;
	var options = {
		optionsBxSlider: {
			pager: false,
			adaptiveHeight: true,
			prevText:'<span class="bullet"></span>',
			nextText:'<span class="bullet"></span>',
			touchEnabled: is_touch_device,
			onSliderLoad: function(currentIndex){
				
			},
			onSlideBefore:function($slideElement, oldIndex, newIndex){
				$slideElement.parent().find('li:eq('+(oldIndex+1)+')').removeClass('item-current');
			},
			onSlideAfter: function($slideElement, oldIndex, newIndex){
				$slideElement.addClass('item-current');
			}
		}
	}

	Gallerybuild(options);
});
