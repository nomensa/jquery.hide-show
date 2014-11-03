/*!
 * jQuery Hide Show
 *
 * @description: Inserts an accessible buttons/links to hide and show sections of content
 * @source: https://github.com/nomensa/jquery.hide-show.git
 * @version: '0.2.1'
 *
 * @author: Nomensa
 * @license: licenced under MIT - http://opensource.org/licenses/mit-license.php
*/

(function ($, window, document, undefined) {
    'use strict';

    var pluginName,
        defaults,
        counter = 0;

    pluginName = 'hideShow';
    defaults = {
        // the class name applied to the hidden element
        hiddenClass: 'hidden',
        // the class name applied to the visible element
        visibleClass: 'visible',
        // the class name applied to the hide/show trigger element
        buttonClass: 'js-hide-show-btn',
        // the string used for the ID to target the button
        buttonId: 'btn-control-',
        // the class name applied to the button when element is collapsed
        buttonCollapsedClass: 'js-hide-show-btn--collapsed',
        // the class name applied to the button when element is expanded
        buttonExpandedClass: 'js-hide-show-btn--expanded',
        // the speed applied to the transition when displaying the element
        speed: 'slow',
        // the text to apply to the button/link phrase for the trigger element when hidden
        showText: 'Show Content',
        // the text to apply to the button/link phrase for the trigger element when visible
        hideText: 'Hide Content',
        // whether the element is hidden or shown by default, options are 'hidden' and 'shown'
        state: 'shown',
        // Identifier for the target content
        containerId: 'content-',
        // A class applied to the target element
        containerClass: 'js-hide-show-content',
        // the class for the content wrapper
        wrapClass: 'js-hide-show',
        // Define the trigger type - options are 'button' and 'anchor'
        triggerType: 'button',
        // Defines whether the triggerElement exists on the page or should be inserted dynamically
        triggerElement: false,
        // Defines the element to use as the triggerElement
        triggerElementClass: 'title',
        // Defines if show/hide functionality is required constantly through mobile to desktop
        continual: true,
        // Breakpoint at which the show/hide functionality displays
        breakpoint: 768,
        // Class applied when the breakpoint is active - options are 'desktop' and 'mobile'
        breakpointClass: 'mobile',
        // The trigger element selector. Relies on 'triggerElement' to be true.
        triggerTargetEl: false
    };

    function ShowHide(element, options) {
    /*
        Constructor function for the hide/show plugin
    */
        var self = this;

        self.element = $(element);
        self.options = $.extend({}, defaults, options);
        self.triggerElementOriginal = self.element.find('.' + self.options.triggerElementClass);

        function init() {
        /*
            Create the button element, put a wrapper around the button and content, set initial state and set up event handlers
        */

            changeToBreakpoint();

            $(window).on('debouncedresize', function() {
                changeToBreakpoint();

                if (self.element.hasClass(self.options.breakpointClass)) {
                    self.destroy();
                } else {
                    if (!self.element.parent().hasClass(self.options.wrapClass)) {
                        init();
                    }
                }
            });

            if (!self.element.hasClass(self.options.breakpointClass)) {
                var triggerElement = createTriggerElement(),
                    wrapper = createWrapper();

                self.element.wrap(wrapper).before(triggerElement);

                self.element.addClass(self.options.containerClass);
                self.element.attr('id', (self.options.containerId + counter));

                if (self.options.state === 'hidden') {
                    self.element.addClass(self.options.hiddenClass).hide();
                    self.element.attr('aria-expanded', 'false');
                } else {
                    self.element.addClass(self.options.visibleClass).show();
                    self.element.attr('aria-expanded', 'true');
                }

                $(triggerElement).click(function() {
                /*
                    On click, show or hide the content based on its state
                */
                    if (self.element.hasClass(self.options.visibleClass)) {
                        self.element.slideUp(self.options.speed);
                        self.element.removeClass(self.options.visibleClass);
                        self.element.addClass(self.options.hiddenClass);
                        self.element.attr('aria-expanded', 'false');
                        $(triggerElement).addClass(self.options.buttonCollapsedClass);
                        $(triggerElement).removeClass(self.options.buttonExpandedClass);

                        if (!self.options.triggerElement) {
                            $(triggerElement).html(self.options.showText);
                        }
                    } else {
                        self.element.slideDown(self.options.speed);
                        self.element.removeClass(self.options.hiddenClass);
                        self.element.addClass(self.options.visibleClass);
                        self.element.attr('aria-expanded', 'true');
                        $(triggerElement).addClass(self.options.buttonExpandedClass);
                        $(triggerElement).removeClass(self.options.buttonCollapsedClass);

                        if (!self.options.triggerElement) {
                            $(triggerElement).html(self.options.hideText);
                        }
                    }
                    return false;
                });

                // Increment counter for unique ID's
                counter++;
            }
        }

        function createTriggerElement() {
        /*
            Create the button element that will hide or show the content
        */
            var triggerElement,
                triggerElementNew,
                attribute = self.options.containerId,
                triggerElementText;

            if (self.options.triggerElement) {

                // If the trigger already exists on the page
                if (self.options.triggerTargetEl) {
                    triggerElement = $(self.options.triggerTargetEl);

                    triggerElement.attr({
                        'class': self.options.buttonClass,
                        'id': self.options.buttonId + counter,
                        'aria-owns': attribute + counter,
                        'aria-controls': attribute + counter
                    });

                    if (self.options.state === 'hidden') {
                        $(triggerElement).html(self.options.showText);
                    } else {
                        $(triggerElement).html(self.options.hideText);
                    }

                } else {
                    triggerElementText = self.triggerElementOriginal.text();
                    self.triggerElementOriginal.hide();

                    if (self.options.triggerType === 'anchor') {
                        triggerElementNew = $('<a href="#" role="button" class="' + self.options.buttonClass + '">' +  triggerElementText + '</a>');
                    } else {
                        triggerElementNew = $('<button class="' + self.options.buttonClass + '" id="' + self.options.buttonId + counter + '" aria-owns="' + attribute + counter + '" aria-controls="' + attribute + counter + '">' +  triggerElementText + '</button>');
                    }
                }

            } else {
                if (self.options.triggerType === 'anchor') {
                    triggerElement = $(document.createElement('a'));

                    triggerElement.attr({
                        'href': '#',
                        'role': 'button'
                    });
                } else {
                    triggerElement = $(document.createElement('button'));
                }

                triggerElement.attr({
                    'class': self.options.buttonClass,
                    'id': self.options.buttonId + counter,
                    'aria-owns': attribute + counter,
                    'aria-controls': attribute + counter
                });

                if (self.options.state === 'hidden') {
                    $(triggerElement).html(self.options.showText);
                } else {
                    $(triggerElement).html(self.options.hideText);
                }
            }

            if (self.options.state === 'hidden') {
                $(triggerElement).addClass(self.options.buttonCollapsedClass);
            } else {
                $(triggerElement).addClass(self.options.buttonExpandedClass);
            }

            return triggerElement;
        }

        function createWrapper() {
        /*
            Create a wrapper to go around the content to be hidden
        */
            var wrapper = $(document.createElement('div'));
            wrapper.attr('class', self.options.wrapClass);
            return wrapper;
        }

        function changeToBreakpoint() {
        /*
            React to a change in screen size breakpoint
        */

            var windowWidth = $(window).width();

            if (!self.options.continual) {
                if (windowWidth >= self.options.breakpoint) {
                    self.element.addClass(self.options.breakpointClass);
                } else {
                    self.element.removeClass(self.options.breakpointClass);
                }
            }

        }

        init();
    }

     // PUBLIC API
    ShowHide.prototype.rebuild = function() {
    /*
        rebuild the plugin and apply show/hide options
    */
        return new ShowHide(this.element, this.options);
    };


    ShowHide.prototype.destroy = function () {
    /*
        Return the dom back to its initial state
    */
        this.element.siblings('.' + this.options.buttonClass).remove();
        $('.' + this.options.wrapClass).find(this.element).unwrap();
        this.element.show();
        this.element.removeClass(this.options.containerClass);
        this.element.removeClass(this.options.hiddenClass);
        this.element.removeClass(this.options.visibleClass);
        this.element.removeAttr('aria-expanded');
        this.element.removeAttr('id');
        this.triggerElementOriginal.show();
    };


    $.fn[pluginName] = function (options) {
    /*
        Guards against multiple instantiations
    */
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new ShowHide(this, options));
            }
        });
    };
})(jQuery, window, document);
