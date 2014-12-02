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
        // the class name applied to the hide/show trigger element
        buttonClass: 'js-hide-show-btn',
        // the class name applied to the button when element is collapsed
        buttonCollapsedClass: 'js-hide-show-btn--collapsed',
        // the class name applied to the button when element is expanded
        buttonExpandedClass: 'js-hide-show-btn--expanded',
        // A class applied to the target element
        containerClass: 'js-hide-show-content',
        // the class name applied to the hidden element
        containerCollapsedClass: 'js-hide-show_content--collapsed',
        // the class name applied to the visible element
        containerExpandedClass: 'js-hide-show_content--expanded',
        // the text to apply to the button/link phrase for the trigger element when visible
        hideText: 'Hide Content',
        // the text to apply to the button/link phrase for the trigger element when hidden
        showText: 'Show Content',
        // the speed applied to the transition when displaying the element
        speed: 'slow',
        // whether the element is hidden or shown by default, options are 'hidden' and 'shown'
        state: 'shown',
        // Define the trigger type - options are 'button' and 'anchor'
        triggerType: 'button',
        // Defines whether the triggerElement exists on the page or should be inserted dynamically
        triggerElementExists: false,
        // Defines the element to use as the triggerElement
        triggerElementTarget: 'title',
        // Defines where the trigger element should be prepended
        prependTriggerLocation: this,
        // the class for the content wrapper
        wrapClass: 'js-hide-show'
    };

    function ShowHide(element, options) {
    /*
        Constructor function for the hide/show plugin
    */
        var self = this;

        self.element = $(element);
        self.options = $.extend({}, defaults, options);
        self.triggerElementOriginal = self.element.find('.' + self.options.triggerElementTarget);

        function init() {
        /*
            Create the button element, put a wrapper around the button and content, set initial state and set up event handlers
        */

            var triggerElement = createTriggerElement(),
                wrapper = createWrapper();


            self.element.wrap(wrapper).before(triggerElement);

            self.element.addClass(self.options.containerClass);
            self.element.attr('id', ('content-' + counter));

            if (self.options.state === 'hidden') {
                self.element.addClass(self.options.containerCollapsedClass).hide();
                triggerElement.attr('aria-expanded', 'false');
            } else {
                self.element.addClass(self.options.containerExpandedClass).show();
                triggerElement.attr('aria-expanded', 'true');
            }

            $(triggerElement).click(function() {
            /*
                On click, show or hide the content based on its state
            */
                if (self.element.hasClass(self.options.containerExpandedClass)) {
                    self.element.slideUp(self.options.speed);
                    self.element.removeClass(self.options.containerExpandedClass);
                    self.element.addClass(self.options.containerCollapsedClass);
                    triggerElement
                        .attr('aria-expanded', 'false')
                        .addClass(self.options.buttonCollapsedClass)
                        .removeClass(self.options.buttonExpandedClass);

                    if (self.options.triggerElementExists === false) {
                        $(triggerElement).html(self.options.showText);
                    }
                } else {
                    self.element.slideDown(self.options.speed);
                    self.element.removeClass(self.options.containerCollapsedClass);
                    self.element.addClass(self.options.containerExpandedClass);
                    triggerElement
                        .attr('aria-expanded', 'true')
                        .addClass(self.options.buttonExpandedClass)
                        .removeClass(self.options.buttonCollapsedClass);

                    if (self.options.triggerElementExists === false) {
                        $(triggerElement).html(self.options.hideText);
                    }
                }
                return false;
            });

            // Increment counter for unique ID's
            counter++;
        }

        function createTriggerElement() {
        /*
            Create the button element that will hide or show the content
        */
            var triggerElement,
                triggerElementNew,
                attribute = 'content-',
                triggerElementText;

            if (self.options.triggerElementExists === true) {
                triggerElementText = self.triggerElementOriginal.text();
                self.triggerElementOriginal.hide();
                if (self.options.triggerType === 'anchor') {
                    triggerElementNew = $('<a href="#" role="button" class="' + self.options.buttonClass + '">' +  triggerElementText + '</a>');
                } else {
                    triggerElementNew = $('<button class="' + self.options.buttonClass + '" aria-controls="' + attribute + counter + '">' +  triggerElementText + '</button>');
                }
                triggerElement = triggerElementNew;
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
        this.element.removeClass(this.options.containerCollapsedClass);
        this.element.removeClass(this.options.containerExpandedClass);
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
