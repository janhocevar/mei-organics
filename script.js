document.addEventListener('DOMContentLoaded', function() {
  var isMobile = window.innerWidth <= 480;

  /**
   * Smoothscrool polyfill
   */
  polyfill();

  /**
   * Scroll to top of the page
   */
  var circleLogo = document.querySelector('.mei-organics-circle');
  circleLogo.addEventListener('click', function(event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /**
   * Language selector
   */
  var languageSelectorEl = document.querySelector('.language-selector');
  var activeLanguageSelectorEl = document.querySelector('.language-selector-active');

  activeLanguageSelectorEl.addEventListener('click', function() {
    languageSelectorEl.classList.toggle('language-selector--opened');
  });

  /**
   * Top banner close
   */
  var topBannerEl = document.querySelector('.top-banner');
  var topBannerCloseEl = document.querySelector('.top-banner-close');
  topBannerCloseEl.addEventListener('click', function() {
    topBannerEl.classList.add('top-banner--hidden');
  });

  /**
   * Animate hero product image
   */
  if (isMobile) {
    setTimeout(addHeroClass, 1000);
  } else {
    addHeroClass();
  }

  function addHeroClass() {
    var heroProduct = document.querySelector('.hero-product');
    heroProduct.classList.add('hero-product--visible');
  }

  /**
   * Add to cart buttons - scroll to shop section
   */
  var addToCartButtons = document.querySelectorAll('.btn-cart');
  var selector = isMobile ? '.shop-customizer-mobile-breakpoint' : '.sixth-section';
  var scrollIntoViewBlock = isMobile ? 'start' : 'center';
  var shopSection = document.querySelector(selector);
  addToCartButtons.forEach(function(button) {
    button.addEventListener('click', function(event){
      event.preventDefault();
      shopSection.scrollIntoView({
        behavior: 'smooth',
        block: scrollIntoViewBlock,
      });
    });
  });

  /**
   * Tabs
   */
  var activeTabClass = 'tab--active';
  var activeTabContentClass = 'tab-content--visible';
  var tabsEl = document.querySelectorAll('.tab');

  tabsEl.forEach(function(el) {
    el.addEventListener('click', function(tabEl) {
      var target = tabEl.target.dataset.tab;
      var targetTabContent = document.querySelector('.tab-content.' + target);

      var activeTab = document.querySelector('.' + activeTabClass);
      var activeTabContent = document.querySelector('.' + activeTabContentClass);

      activeTab.classList.remove(activeTabClass);
      activeTabContent.classList.remove(activeTabContentClass);

      tabEl.target.classList.add(activeTabClass);
      targetTabContent.classList.add(activeTabContentClass);
    });
  });

  /**
   * Instagram
   */
  fetch('https://www.instagram.com/mei_organics/?__a=1')
    .then(function(response) { return response.json(); })
    .then(function(response) {
      if (response && response.graphql && response.graphql.user) {
        var images = response.graphql.user.edge_owner_to_timeline_media.edges.map(function(image) {
          return {
            image: image.node.display_url,
            url: image.node.shortcode,
          };
        }).slice(0, 20);

        var offsetSize = 230;
        var numberOfImagesOnScreen = Math.floor(window.innerWidth / offsetSize);

        var instagramPhotosEl = document.querySelector('.instagram-feed');
        var instagramPhotosInnerEl = document.querySelector('.instagram-feed--inner');

        images.forEach(function(image) {
          var newDiv = document.createElement('a');
          newDiv.setAttribute('href', 'https://www.instagram.com/p/' + image.url);
          newDiv.setAttribute('target', '_blank');
          newDiv.classList.add('instagram-photo');
          newDiv.style.backgroundImage = 'url(' + image.image + ')';

          instagramPhotosInnerEl.appendChild(newDiv);
        });

        instagramPhotosInnerEl.style.width = images.length * offsetSize + 'px';

        var instagramLoadingEl = document.querySelector('.loading-instagram-photos');
        instagramLoadingEl.classList.add('loading-instagram-photos--hidden');

        instagramPhotosEl.classList.add('instagram-feed--loaded');

        /**
         * Handlers
         */
        var handles = document.querySelectorAll('.instagram-handle');
        var picturesOffset = 0;
        handles.forEach(function(handleEl) {
          handleEl.addEventListener('click', function(el) {
            var direction = el.target.dataset.direction;

            /**
             * If on first picture and back is clicked, ignore
             */
            if (picturesOffset === 0 && direction === 'back') {
              return;
            }

            /**
             * If on last picture, return
             */
            if (((numberOfImagesOnScreen + 1 + picturesOffset) === images.length || numberOfImagesOnScreen >= images.length) && direction === 'forward') {
              return;
            }

            /**
             * Get transformX offset
             */
            var feedStyle = window.getComputedStyle(instagramPhotosInnerEl);
            var matrix = new WebKitCSSMatrix(feedStyle.webkitTransform);
            var offsetx = matrix.m41;
            

            if (direction === 'forward') {
              offsetx -= offsetSize;
              picturesOffset++;
            } else if (direction === 'back') {
              offsetx += offsetSize;
              picturesOffset--;
            }
            
            instagramPhotosInnerEl.style.transform = 'translateX(' + offsetx + 'px)';
          });
        });
      }
    });

  /**
   * Viewport Animations (ScrollMagic)
   */
  var controller = new ScrollMagic.Controller();
  var preselectProduct = new ScrollMagic.Scene({ triggerElement: '.sixth-section' })
    .setClassToggle('.shop-option--preselect', 'shop-option--selected')
    .reverse(false)
    .addTo(controller);

  var bottomHeroTween = new TimelineMax()
    .add([
      TweenMax.fromTo('.bottom-hero-product', 2, { y: 80 }, { y: 0, ease: Linear.easeNone, immediateRender: false })
    ]);

  bottomHeroAnimation = new ScrollMagic.Scene({triggerElement: '.bottom-hero', duration: 300})
    .setTween(bottomHeroTween)
    .addTo(controller);

  if (isMobile) {
    var circleLogoShowTween = new TimelineMax()
    .add([
      TweenMax.fromTo('.mei-organics-circle', 2, { opacity: 0 }, { opacity: 1, ease: Linear.easeNone, immediateRender: false })
    ]);

    var circleLogoShow = new ScrollMagic.Scene({ triggerElement: '.first-section', duration: 100, offset: 300 })
      .setTween(circleLogoShowTween)
      .addTo(controller);

    imagesPin = new ScrollMagic.Scene({
      triggerElement: '.fourth-section',
      duration: 600,
      offset: 300,
    })
      .setPin('.fourth-section')
      .addTo(controller);
  }

  /**
   * Shop quantity selector
   */
  var shopOptions = document.querySelectorAll('.shop-option');
  var selectedClass = 'shop-option--selected';
  shopOptions.forEach(function(option) {
    option.addEventListener('click', function(el) {
      var selectedEl = document.querySelector('.' + selectedClass);
      selectedEl.classList.remove(selectedClass);

      el.target.classList.add(selectedClass);
    });
  });

  /**
   * Mobile swipe
   */
  var element = document.querySelector('.swipe');
  var activeNavigationItemClass = 'swipe-navigation-item--active';
  window.mySwipe = new Swipe(element, {
    startSlide: 0,
    auto: 4000,
    draggable: false,
    autoRestart: false,
    continuous: true,
    disableScroll: true,
    stopPropagation: true,
    callback: function(index, element) { },
    transitionEnd: function(index, element) {
      var activeNavigationItem = document.querySelector('.' + activeNavigationItemClass);
      activeNavigationItem.classList.remove(activeNavigationItemClass);

      var newActiveNavigationItem = document.querySelectorAll('.swipe-navigation-item')[index];
      newActiveNavigationItem.classList.add(activeNavigationItemClass);
    }
  });

  /**
   * Show more feedbacks
   */
  var showMoreFeedbacksButton = document.querySelector('.btn--feedback');
  var showMoreReviewHiddenClass = 'single-feedback--hidden';
  var hiddenReviews = document.querySelectorAll('.' + showMoreReviewHiddenClass);

  showMoreFeedbacksButton.addEventListener('click', function() {
    hiddenReviews.forEach(function(el) {
      el.classList.remove(showMoreReviewHiddenClass);
    });

    showMoreFeedbacksButton.remove();
  });
});
