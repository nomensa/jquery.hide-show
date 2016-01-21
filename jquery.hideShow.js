/*!
 * jQuery Hide Show
 *
 * @description: Inserts an accessible buttons/links to hide and show sections of content
 * @source: https://github.com/nomensa/jquery.hide-show.git
 * @version: '1.1.0'
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
        buttonClass: 'js-hide-show_btn',
        // the class name applied to the button when element is collapsed
        buttonCollapsedClass: 'js-hide-show_btn--collapsed',
        // the class name applied to the button when element is expanded
        buttonExpandedClass: 'js-hide-show_btn--expanded',
        // Callback when the plugin is created
        callbackCreate: function() {},
        // Callback when the plugin is destroyed
        callbackDestroy: function() {},
        // A class applied to the target element
        containerClass: 'js-hide-show_content',
        // the class name applied to the hidden element
        containerCollapsedClass: 'js-hide-show_content--collapsed',
        // the class name applied to the visible element
        containerExpandedClass: 'js-hide-show_content--expanded',
        // Whether the content closes when clicking elsewhere in the document
        closeOnClick: false,
        // the text to apply to the button/link phrase for the trigger element when visible
        hideText: 'Hide Content',
        // Method that is used to insert the trigger button into the location, options are 'after', 'append' 'before' and 'prepend'
        insertMethod: 'before',
        // Defines if the generated trigger element should be inserted to somewhere other than directly before the element
        insertTriggerLocation: null,
        // the text to apply to the button/link phrase for the trigger element when hidden
        showText: 'Show Content',
        // the speed applied to the transition when displaying the element
        speed: 'slow',
        // whether the element is hidden or shown by default, options are 'hidden' and 'shown'
        state: 'shown',
        // Defines if an existing element should act as the trigger element
        triggerElementTarget: null,
        // The type of animation that will occur when hiding and showing content.
        // Other option is 'leftToRight'
        animation: 'topToBottom'
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
            Our init function to create an instance of the plugin
        */
            // Create or use an existing element as the trigger
            self.triggerElement = createTriggerElement();

            // Init the target element with classes and attributes
            self.element
                .addClass(self.options.containerClass)
                .attr('id', ('content-' + counter));

            // We need to be able to move focus to the element if the trigger doesnt immediately precede it
            if (self.options.insertTriggerLocation !== null) {
                self.element.attr('tabindex', '-1');
            }

            if (self.options.state === 'hidden') {
                self.element
                    .addClass(self.options.containerCollapsedClass)
                    .attr('aria-hidden', 'true');

                // Hide in different ways depending on animation
                switch (self.options.animation) {

                    case 'topToBottom':
                        self.element.hide();
                        break;

                    case 'leftToRight':
                        var css = {
                            left: '-100%',
                            position: 'absolute'
                        };

                        self.element.css(css);
                        break;
                }

                self.triggerElement.attr('aria-expanded', 'false');
            } else {
                self.element
                    .addClass(self.options.containerExpandedClass)
                    .attr('aria-hidden', 'false')
                    .show();

                self.triggerElement.attr('aria-expanded', 'true');
            }

            // Add the trigger element into the DOM
            if (self.options.insertTriggerLocation === null) {
                self.element.before(self.triggerElement);
            } else {
                switch (self.options.insertMethod) {
                    case 'after':
                        $(self.options.insertTriggerLocation).after(self.triggerElement);
                        break;
                    case 'append':
                        $(self.options.insertTriggerLocation).append(self.triggerElement);
                        break;
                    case 'prepend':
                        $(self.options.insertTriggerLocation).prepend(self.triggerElement);
                        break;
                    default:
                        // Default to before
                        $(self.options.insertTriggerLocation).before(self.triggerElement);
                }
            }

            // Increment counter for unique ID's
            counter++;

            self.options.callbackCreate();
        }

        function createTriggerElement() {
        /*
            Create or initialize an existing element as the trigger element
        */
            var triggerElement,
                attribute = 'content-';

            if (self.options.triggerElementTarget === null) {
                triggerElement = $(document.createElement('button'));

                triggerElement.attr({
                    'aria-controls': attribute + counter,
                    'class': self.options.buttonClass
                });

                if (self.options.state === 'hidden') {
                    $(triggerElement).html(self.options.showText);
                } else {
                    $(triggerElement).html(self.options.hideText);
                }

                // Bind event handlers to trigger element
                $(triggerElement).click(createHandleClick(self));
            } else {
                triggerElement = $(self.options.triggerElementTarget);

                triggerElement.attr({
                    'aria-controls': attribute + counter,
                    'class': self.options.buttonClass,
                    'role': 'button',
                    'tabindex': '0'
                });

                // Bind event handlers to trigger element
                $(triggerElement)
                    .click(createHandleClick(self))
                    .keydown(createHandleKeyDown(self));
            }

            if (self.options.state === 'hidden') {
                $(triggerElement).addClass(self.options.buttonCollapsedClass);
            } else {
                $(triggerElement).addClass(self.options.buttonExpandedClass);
            }

            return triggerElement;
        }

        function createHandleClick() {
        /*
            Create the click event handle
        */
            self.handleClick = function(event) {
                event.preventDefault();

                self.toggle();

                // Note that this is meant to work for content that has been triggered
                // and not open by default
                if (self.options.closeOnClick === true) {
                    // If open
                    if (self.element.attr('aria-hidden') === 'false') {
                        // Hide the content if clicked elsewhere in the document
                        $(document).mouseup(function(event) {
                            var content = self.element,
                                target = event.target;

                            // If clicked on elsewhere (nor a descendant of the content)
                            if (!content.is(target) && content.has(target).length === 0) {

                                // If the trigger button is not clicked on
                                if (!self.triggerElement.is(target)) {
                                    self.close();
                                }
                            }
                        });
                    }
                }
            };

            return self.handleClick;
        }

        function createHandleKeyDown() {
        /*
            Create the keydown event handle
        */
            self.handleKeyDown = function(event) {
                // enter or spacebar
                if (event.keyCode === 13 || event.keyCode === 32) {
                    self.toggle();
                }
            };
            return self.handleKeyDown;
        }

        init();
    }

    ShowHide.prototype.toggle = function() {
    /*
        Public method for toggling the element
    */
        if (this.element.attr('aria-hidden') === 'true') {
            this.open();
        } else {
            this.close();
        }
    };

    ShowHide.prototype.open = function() {
    /*
        Public method for opening the element
    */
        var self = this,
            animateComplete,
            css;

        self.element
            .addClass(this.options.containerExpandedClass)
            .attr('aria-hidden', 'false')
            .removeClass(this.options.containerCollapsedClass);

        // Animate from the options
        switch (this.options.animation) {

            case 'topToBottom':
                animateComplete = function() {
                    // Move focus to the open element if trigger doesnt immediately precede it
                    if (self.options.insertTriggerLocation !== null) {
                        self.element.focus();
                    }
                };

                self.element.slideDown(this.options.speed, animateComplete);
                break;

            case 'leftToRight':
                animateComplete = function() {
                    // Move focus to the open element if trigger doesnt immediately precede it
                    if (self.options.insertTriggerLocation !== null) {
                        self.element.focus();
                    }
                };
                css = {
                    left: '0'
                };

                self.element.animate(css, this.options.speed, animateComplete);
                break;
        }

        self.triggerElement
            .addClass(this.options.buttonExpandedClass)
            .attr('aria-expanded', 'true')
            .removeClass(this.options.buttonCollapsedClass);

        if (self.options.triggerElementTarget === null) {
            self.triggerElement.html(this.options.hideText);
        }
    };

    ShowHide.prototype.close = function() {
    /*
        Public method for hiding the element
    */
        var self = this;

        self.element
            .addClass(this.options.containerCollapsedClass)
            .attr('aria-hidden', 'true')
            .removeClass(this.options.containerExpandedClass);



        // Animate from the options
        switch (this.options.animation) {

            case 'topToBottom':
                this.element.slideUp(this.options.speed);
                break;

            case 'leftToRight':
                var css = {
                    left: '-100%'
                };

                self.element.animate(css, this.options.speed);
                break;
        }

        self.triggerElement
            .addClass(this.options.buttonCollapsedClass)
            .attr('aria-expanded', 'false')
            .removeClass(this.options.buttonExpandedClass);

        if (self.options.triggerElementTarget === null) {
            self.triggerElement.html(this.options.showText);
        }
    };

    ShowHide.prototype.rebuild = function() {
    /*
        Public method for rebuild the plugin and apply options
    */
        return new ShowHide(this.element, this.options);
    };

    ShowHide.prototype.destroy = function () {
    /*
        Public method for return the DOM back to its initial state
    */
        var triggerElementRef = this.element.attr('id');

        this.element
            .removeAttr('aria-hidden id style')
            .removeClass(this.options.containerClass)
            .removeClass(this.options.containerCollapsedClass)
            .removeClass(this.options.containerExpandedClass);

        // If an existing element was used we want to return it to its original state, not remove it completely
        if (this.options.triggerElementTarget === null) {
            this.triggerElement.remove(); // only works first time, does not work when plugin is rebuild hence the fallback
            $('[aria-controls="' + triggerElementRef + '"]').remove();
        } else {
            this.triggerElement
                .off()
                .removeAttr('aria-controls aria-expanded role tabindex')
                .removeClass(this.options.buttonClass)
                .removeClass(this.options.buttonCollapsedClass)
                .removeClass(this.options.buttonExpandedClass);
        }

        this.options.callbackDestroy();
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