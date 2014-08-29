/*!
 * jQuery Hide Show
 *
 * @description: Inserts an accessible buttons/links to hide and show sections of content
 * @source: https://github.com/nomensa/jquery.hide-show.git
 * @version: '0.1.1'
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
        // the class name applied to the element inside the button (used to hide text off screen)
        buttonHelperClass: 'hide',
        // the string used for the ID to target the button
        buttonId: 'btn-control-',
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
        // Define the trigger element as an anchor rather than a button - true is an anchor, false is a button
        triggerElement: false
    };

    function ShowHide(element, options) {
    /*
        Constructor function for the hide/show plugin
    */
        var self = this;

        self.element = $(element);
        self.options = $.extend({}, defaults, options);

        function init() {
        /*
            Create the button element, put a wrapper around the button and content, set initial state and set up event handlers
        */
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

                    $(triggerElement).removeClass(self.options.buttonExpandedClass);
                    $('span', triggerElement).text(self.options.showText);
                } else {
                    self.element.slideDown(self.options.speed);
                    self.element.removeClass(self.options.hiddenClass);
                    self.element.addClass(self.options.visibleClass);
                    self.element.attr('aria-expanded', 'true');

                    $(triggerElement).addClass(self.options.buttonExpandedClass);
                    $('span', triggerElement).text(self.options.hideText);
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
                attribute = self.options.containerId,
                buttonHelper = '<span class="' + self.options.buttonHelperClass + '"/>';

            if (self.options.triggerElement) {
                triggerElement = $(document.createElement('a')).html(buttonHelper);

                triggerElement.attr({
                    'href': '#',
                    'role': 'button'
                });
            } else {
                triggerElement = $(document.createElement('button')).html(buttonHelper);
            }

            triggerElement.attr({
                'class': self.options.buttonClass,
                'id': self.options.buttonId + counter,
                'aria-owns': attribute + counter,
                'aria-controls': attribute + counter
            });

            if (self.options.state === 'hidden') {
                $('span', triggerElement).text(self.options.showText);
            } else {
                $('span', triggerElement).text(self.options.hideText);

                triggerElement.addClass(self.options.buttonExpandedClass);
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


    ShowHide.prototype.destroy = function () {
    /*
        Return the dom back to its initial state
    */
        var self = this;
        self.element.siblings('button').remove();
        self.element.unwrap().show();
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