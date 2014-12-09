'use strict';

describe('hide-show', function() {

    var markUp =
            '<div>' +
                '<p>Text content to be hidden text content to be hidden text content to be hidden text content to be hidden</p>' +
            '</div>',
        testElement;

    var markUp2 =
            '<div class="container">' +
                '<h3 id="trigger">Contact details</h3>' +
                '<div>' +
                    '<p>Telephone 01234 567 890</p>' +
                    '<p>Email <a href="mailto:test@test.com">test@test.com</a></p>' +
                '</div>' +
            '</div>',
        testElement2;

    beforeEach(function() {
        testElement = $(markUp);
    });

    it('depends on jQuery', function() {
        expect($).toBeDefined();
    });

    it('should be protected against multiple instantiations', function() {
        var plugin = testElement.hideShow();
        expect(plugin === testElement.hideShow()).toBe(true);
    });

    describe('- plugin init', function() {

        beforeEach(function() {
            testElement.hideShow();
        });

        it('should be available with the showHide identifier', function() {
            expect($('<div></div>').hideShow).toBeDefined();
        });

        it('should add a class and ID to the content to be hidden', function() {
            expect(testElement.hasClass('js-hide-show_content')).toBe(true);
            expect(testElement.attr('id')).toContain('content');
        });

        it('should set the state to visible by default', function() {
            expect(testElement.hasClass('js-hide-show_content--expanded')).toBe(true);
            expect(testElement.attr('aria-hidden')).toBe('false');
            expect(testElement.css('display')).toBe('block');

            expect(testElement.siblings('.js-hide-show_btn').attr('aria-expanded')).toBe('true');
        });

        it('should insert the trigger element before the content by default', function() {
            expect(testElement.prev('.js-hide-show_btn').length).toBe(1);
        });

        describe('- createTriggerElement function', function() {

            it('should create the trigger element', function() {
                var testElementId = testElement.attr('id');

                expect(testElement.siblings('.js-hide-show_btn').attr('aria-controls')).toBe(testElementId);
                expect(testElement.siblings('.js-hide-show_btn').hasClass('js-hide-show_btn')).toBe(true);
                expect(testElement.siblings('.js-hide-show_btn').text()).toBe('Hide Content');
            });
        });
    });

    describe('- toggle function', function() {

        beforeEach(function() {
            testElement.hideShow();
            spyOn(jQuery.fn, 'slideUp');
            spyOn(jQuery.fn, 'slideDown');
        });

        it('should toggle the content open when closed', function() {
            var button = testElement.siblings('.js-hide-show_btn');

            button.click();
            expect(jQuery.fn.slideUp).toHaveBeenCalled();
        });

        it('should toggle the content closed when open', function() {
            var button = testElement.siblings('.js-hide-show_btn');

            testElement.data('plugin_hideShow').close();

            button.click();
            expect(jQuery.fn.slideDown).toHaveBeenCalled();
        });
    });

    describe('- open method', function() {

        beforeEach(function() {
            testElement.hideShow();
            spyOn(jQuery.fn, 'slideDown');
        });

        it('should open the content when the trigger element is clicked', function() {
            var button = testElement.siblings('.js-hide-show_btn');

            testElement.data('plugin_hideShow').close();
            button.click();

            expect(testElement.hasClass('js-hide-show_content--expanded')).toBe(true);
            expect(testElement.attr('aria-hidden')).toBe('false');
            expect(jQuery.fn.slideDown).toHaveBeenCalled();
        });

        it('should update the trigger element when it is clicked', function() {
            var button = testElement.siblings('.js-hide-show_btn');

            testElement.data('plugin_hideShow').close();
            button.click();

            expect(button.hasClass('js-hide-show_btn--expanded')).toBe(true);
            expect(button.attr('aria-expanded')).toBe('true');
            expect(button.text()).toBe('Hide Content');
        });
    });

    describe('- close method', function() {

        beforeEach(function() {
            testElement.hideShow();
            spyOn(jQuery.fn, 'slideUp');
        });

        it('should close the content when the trigger element is clicked', function() {
            var button = testElement.siblings('.js-hide-show_btn');

            button.click();

            expect(testElement.hasClass('js-hide-show_content--collapsed')).toBe(true);
            expect(testElement.attr('aria-hidden')).toBe('true');
            expect(jQuery.fn.slideUp).toHaveBeenCalled();
        });

        it('should update the trigger element when it is clicked', function() {
            var button = testElement.siblings('.js-hide-show_btn');

            button.click();

            expect(button.hasClass('js-hide-show_btn--collapsed')).toBe(true);
            expect(button.attr('aria-expanded')).toBe('false');
            expect(button.text()).toBe('Show Content');
        });
    });

    describe('- rebuild method', function() {

        it('should reinitiate the plugin', function() {
            var plugin = testElement.hideShow();

            plugin.data('plugin_hideShow').destroy();
            plugin.data('plugin_hideShow').rebuild();

            expect(plugin === testElement.hideShow()).toBe(true);
        });
    });

    describe('- destroy method', function() {

        beforeEach(function() {
            testElement2 = $(markUp2);

            testElement.hideShow();

            testElement.data('plugin_hideShow').destroy();
        });

        it('should reset the content element back to its original state', function() {
            expect(testElement.attr('aria-hidden')).toBe(undefined);
            expect(testElement.attr('id')).toBe(undefined);
            expect(testElement.attr('style')).toBe(undefined);
            expect(testElement.hasClass('js-hide-show_content')).toBe(false);
            expect(testElement.hasClass('js-hide-show_content--collapsed')).toBe(false);
            expect(testElement.hasClass('js-hide-show_content--expanded')).toBe(false);
        });

        it('should remove the trigger element', function() {
            expect(testElement.siblings('.js-hide-show_btn').length).toBe(0);
        });

        it('should reset the trigger element back to its original state', function() {
            var trigger = $('#trigger', testElement2);

            testElement2.find('div').hideShow({
                triggerElementTarget: trigger
            });

            testElement2.find('div').data('plugin_hideShow').destroy();

            var testElementId = testElement2.find('div').attr('id');

            expect(trigger.attr('aria-controls')).toBe(undefined);
            expect(trigger.attr('aria-expanded')).toBe(undefined);
            expect(trigger.attr('role')).toBe(undefined);
            expect(trigger.attr('tabindex')).toBe(undefined);
            expect(trigger.hasClass('js-hide-show_btn')).toBe(false);
            expect(trigger.hasClass('js-hide-show_btn--expanded')).toBe(false);
            expect(trigger.hasClass('js-hide-show_btn--collapsed')).toBe(false);
        });
    });

    describe('- plugin options', function() {

        beforeEach(function() {
            testElement2 = $(markUp2);
        });

        it('should add a tabindex of -1 to the element if the trigger does not immediately precede it', function() {
            testElement2.find('div').hideShow({
                insertMethod: 'append',
                insertTriggerLocation: testElement2
            });

            expect(testElement2.find('div').attr('tabindex')).toBe('-1');
        });

        it('should hide the content if the state is set to "hidden"', function() {
            testElement.hideShow({
                state: 'hidden'
            });

            expect(testElement.hasClass('js-hide-show_content--collapsed')).toBe(true);
            expect(testElement.attr('aria-hidden')).toBe('true');
            expect(testElement.css('display')).toBe('none');

            expect(testElement.siblings('.js-hide-show_btn').attr('aria-expanded')).toBe('false');
            expect(testElement.siblings('.js-hide-show_btn').text()).toBe('Show Content');
        });

        it('should insert the trigger element after the content if the insertMethod is set to "after"', function() {
            testElement2.find('div').hideShow({
                insertMethod: 'after',
                insertTriggerLocation: testElement2
            });

            expect(testElement2.next('.js-hide-show_btn').length).toBe(1);
        });

        it('should insert the trigger element after the content if the insertMethod is set to "append"', function() {
            testElement2.find('div').hideShow({
                insertMethod: 'append',
                insertTriggerLocation: testElement2
            });

            expect(testElement2.find('div').next('.js-hide-show_btn').length).toBe(1);
        });

        it('should insert the trigger element after the content if the insertMethod is set to "prepend"', function() {
            testElement2.find('div').hideShow({
                insertMethod: 'prepend',
                insertTriggerLocation: testElement2
            });

            expect(testElement2.find('h3').prev('.js-hide-show_btn').length).toBe(1);
        });

        it('should default to inserting the trigger element before the content if the insertMethod is not "after", "append" or "prepend"', function() {
            testElement2.find('div').hideShow({
                insertMethod: '',
                insertTriggerLocation: testElement2.find('div')
            });

            expect(testElement2.find('div').prev('.js-hide-show_btn').length).toBe(1);
        });

        it('should use an existing element if the triggerElementTarget option is given', function() {
            var trigger = $('#trigger', testElement2);

            testElement2.find('div').hideShow({
                triggerElementTarget: trigger
            });

            var testElementId = testElement2.find('div').attr('id');

            expect(trigger.attr('aria-controls')).toBe(testElementId);
            expect(trigger.hasClass('js-hide-show_btn')).toBe(true);
            expect(trigger.attr('role')).toBe('button');
            expect(trigger.attr('tabindex')).toBe('0');
        });

        it('should customise the "hideText" used for the button', function() {
            testElement.hideShow({
                hideText: 'Collapse details'
            });

            expect(testElement.siblings('.js-hide-show_btn').text()).toBe('Collapse details');
        });

        it('should customise the "showText" used for the button', function() {
            testElement.hideShow({
                showText: 'Expand details',
                state: 'hidden'
            });

            expect(testElement.siblings('.js-hide-show_btn').text()).toBe('Expand details');
        });

        it('should customise the class on the button', function() {
            testElement.hideShow({
                buttonClass: 'trigger-button'
            });
            expect(testElement.siblings('.trigger-button').length).toBe(1);
        });

        it('should customise the collapsed class on the button', function() {
            testElement.hideShow({
                buttonExpandedClass: 'collapsed'
            });
            expect(testElement.siblings('.js-hide-show_btn').hasClass('collapsed')).toBe(true);
        });

        it('should customise the expanded class on the button', function() {
            testElement.hideShow({
                buttonExpandedClass: 'expanded'
            });
            expect(testElement.siblings('.js-hide-show_btn').hasClass('expanded')).toBe(true);
        });

        it('should customise the class on the container', function() {
            testElement.hideShow({
                containerClass: 'container'
            });
            expect(testElement.hasClass('container')).toBe(true);
        });

        it('should customise the collapsed class on the container', function() {
            testElement.hideShow({
                containerCollapsedClass: 'collapsed',
                state: 'hidden'
            });
            expect(testElement.hasClass('collapsed')).toBe(true);
        });

        it('should customise the expanded class on the container', function() {
            testElement.hideShow({
                containerExpandedClass: 'expanded'
            });
            expect(testElement.hasClass('expanded')).toBe(true);
        });

        it('should trigger "callbackCreate" once the plugin has been created', function() {
            var mocks,
                el,
                created = false;

            mocks = {
                callbackCreate: function(testElement) {
                    created = true;
                }
            },
            el = testElement.hideShow({
                callbackCreate: mocks.callbackCreate
            });

            expect(created).toBe(true);
        });

        it('should trigger "callbackDestroy" once the plugin has been destroyed', function() {
            var mocks,
                el,
                destroyed = false;

            mocks = {
                callbackDestroy: function(testElement) {
                    destroyed = true;
                }
            },
            el = testElement.hideShow({
                callbackDestroy: mocks.callbackDestroy
            });

            el.data('plugin_hideShow').destroy();

            expect(destroyed).toBe(true);
        });
    });
});