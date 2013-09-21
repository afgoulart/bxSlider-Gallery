var gallerySliders = {};
(function(){
	/* 
		Galeria de fotos jquery
		
		Autores:
		André Filipe 
		afgoulart.rj@gmail.com || @afgoulart || fb/afgoulart.rj

		Diego Zoracky

		repositório
		https://github.com/afgoulart/bxSlider-Gallery

		Require:
			- jQuery 1.7.2+
			- bxSlider - http://bxslider.com/
				(Docs bxSlider - http://bxslider.com/options)
		Opcional:
			- Modernizr para detectar os recursos de HTML5 e CSS3 do navegador do usuário.
			(Modernizr - http://modernizr.com/)
	*/

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
			seletorContentGallery: '.content-gallery',
			seletorChangeGallery: '.changeGallery',
			seletorChangeGalleryContentLink: '.gallery',
			keybordControls: true,
			optionsBxSlider: {
			}
		};

		$.extend(settings, opt);

		var $allGalleries = $(settings.seletorGallery);

		if(!$allGalleries.size()) return false;


		$(settings.seletorParentGallery).on('click.togglePainels', '.content-gallery img', function(){
			$(this).parents(settings.seletorGallery).togglePainels('slow', false);
		});

		$allGalleries.addClass('hidden');

		//TODO :: ajustar esse trecho
		var $galleryContent = $allGalleries.eq(0);

		$slideContent = $galleryContent.find(".bx-slider");

		$(settings.seletorChangeGallery + " a").on('click.changeGallery',function(e){
			e.preventDefault();
			var $link = $(this);
			var idGallery = $link.data('target');
			var $currentGallery = $(settings.seletorGallery).filter('.current-gallery');
			var $gallery = $('#'+idGallery);

			if($(settings.seletorGallery).size() === 1){

				if(!$gallery.find('.bx-slider').data('galleryLoaded')){
					$gallery.addClass('hidden');
					$gallery.find('.bx-slider').createSlide(idGallery);
					$gallery.find(settings.seletorsPanelGalley).data('element-hide',true).addClass(settings.classPanelGallery);

					$gallery.fadeIn(200, function(){
						$gallery.addClass('current-gallery');
						$gallery.removeClass('hidden');
						$link.parent().addClass('active');
					});
				}

			}else{

				if($currentGallery.size() === 1 && $currentGallery.attr('id') == idGallery){
					return false;
				}

				$gallery.togglePainels('slow', true);

				if($currentGallery.size() === 0){
					$currentGallery = $gallery;
				}

				$currentGallery.fadeOut(200, function(){
					$currentGallery.removeClass('current-gallery');
					$(settings.seletorChangeGallery + " " + settings.seletorChangeGalleryContentLink).removeClass('active');

					if(!$gallery.find('.bx-slider').data('galleryLoaded')){
						$gallery.addClass('hidden');
						$gallery.find('.bx-slider').createSlide(idGallery);
						$gallery.find(settings.seletorsPanelGalley).data('element-hide',true).addClass(settings.classPanelGallery);
					}

					$gallery.fadeIn(200, function(){
						$gallery.addClass('current-gallery')
						$gallery.removeClass('hidden');
						$link.parent().addClass('active');
					});
				});

			}

			return false;
		});

		$(settings.seletorChangeGallery + " a").first().trigger('click');

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

					if(event.which == 13){ //HIDE PANELS
						$currentGallery.find('.item-current ' + settings.seletorContentGallery + ' > img').trigger('click');
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

	};

	$.fn.changeGalleryKeybord = function(direction){
		var id = this.get(0).id;
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
			var checkCSSTransition = $('html').hasClass('csstransitions') || 'transition' in document.getElementsByTagName('body').item().style;
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
		var $thisGallery = $('#'+idGallery);

		this.data('galleryLoaded', true);
		if(settings.optionsBxSlider.onSliderLoad)
			var defaultOnSliderLoad = settings.optionsBxSlider.onSliderLoad;
		else
			var defaultOnSliderLoad = function(){};

		if(!settings.optionsBxSlider.touchEnabled){
			var is_touch_device = 'ontouchstart' in document;
			settings.optionsBxSlider.touchEnabled = is_touch_device;
		}

		settings.optionsBxSlider.onSliderLoad = function(currentIndex){
			defaultOnSliderLoad(currentIndex);
			$slideContent.find('li:eq('+(currentIndex+1)+')').addClass('item-current');

			$thisGallery.find(settings.seletorNext).data('direction-hide', 'right');
			$thisGallery.find(settings.seletorPrev).data('direction-hide', 'left');
			$thisGallery.find(settings.seletorHeader).data('direction-hide', 'top');
			$thisGallery.find(settings.seletorFooter).data('direction-hide', 'bottom');
			$thisGallery.find(settings.seletorsPanelGalley).data('element-hide', true).addClass(settings.classPanelGallery);

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
	
	var options = {
		optionsBxSlider: {
			pager: false,
			adaptiveHeight: true,
			prevText:'<span class="bullet"></span>',
			nextText:'<span class="bullet"></span>',
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