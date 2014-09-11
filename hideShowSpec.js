'use strict';

describe('hide-show', function () {

    var markUp =
            '<div class="search">' +
              '<form>' +
                '<label>Search </label>' +
                '<input type="search" />' +
                '<input type="submit" value="Search" />' +
              '</form>' +
            '</div>',
        testElement;

    beforeEach(function () {
        testElement = $(markUp);
    });

    it("depends on jQuery", function () {
        expect($).toBeDefined();
    });

    describe('- plugin init', function () {

        afterEach(function () {
            testElement.find('button').remove();
            testElement.unwrap().show();
        });

        it('should be protected against multiple instantiations', function () {
            var plugin = testElement.hideShow();
            expect(plugin === testElement.hideShow()).toBe(true);
        });

        it('should be available with the showHide identifier', function () {
            expect($('<div></div>').hideShow).toBeDefined();
        });


        it('should wrap the content to be hidden in a div with a class of "js-hide-show"', function () {
            testElement.hideShow();
            expect(testElement.parent().hasClass('js-hide-show')).toBe(true);
            expect(testElement.parent().prop('tagName')).toBe('DIV');
        });

        it('should prepend the content to be hidden with a button used to hide it', function () {
            testElement.hideShow();
            expect(testElement.siblings('button').length).toBe(1);
        });

        it('should add a class of "js-hide-show-btn" to the button', function () {
            testElement.hideShow();
            expect(testElement.siblings('button').hasClass('js-hide-show-btn')).toBe(true);
        });

        it('should add an ID with a user defined string to the button', function () {
            testElement.hideShow({
                buttonId: 'testControl'
            });
            expect(testElement.siblings('button').attr('id')).toContain('testControl');
        });

        it('should set an aria-owns attribute on the button', function () {
            testElement.hideShow();
            expect(testElement.siblings('button').attr('aria-owns')).toBeDefined();
        });

        it('should set an aria-owns attribute to be associated with the relevant content', function () {
            testElement.hideShow();
            var id = testElement.attr('id');
            expect(testElement.siblings('button').attr('aria-owns')).toBe(id);
        });

        it('should set an aria-controls attribute on the button', function () {
            testElement.hideShow();
            expect(testElement.siblings('button').attr('aria-controls')).toBeDefined();
        });

        it('should set an aria-controls attribute to be associated with the relevant content', function () {
            testElement.hideShow();
            var id = testElement.attr('id');
            expect(testElement.siblings('button').attr('aria-controls')).toBe(id);
        });

        it('should add an id of content to the target element', function () {
            testElement.hideShow();
            expect(testElement.attr('id')).toContain('content');
        });

    });


    describe('- plugin options', function () {

        it('should show the content by default if the state is set to "shown"', function () {
            testElement.hideShow({
                state: 'shown'
            });
            expect(testElement.hasClass('visible')).toBe(true);
        });

        it('should set the default aria-expanded attribute value to true if the state is set to "shown"', function () {
            testElement.hideShow();
            expect(testElement.attr('aria-expanded')).toBe('true');
        });

        it('should not show the content by default if the state is set to "hidden"', function () {
            testElement.hideShow({
                state: 'hidden'
            });
            expect(testElement.is(':hidden')).toBe(true);
        });

        it('should set the default aria-expanded attribute value to false if the state is set to "hidden"', function () {
            testElement.hideShow({
                state: 'hidden'
            });
            expect(testElement.attr('aria-expanded')).toBe('false');
        });

        it('should set the text used for the hide button', function () {
            testElement.hideShow({
                hideText: 'Expand Search'
            });
            expect(testElement.siblings('button').text()).toBe('Expand Search');
        });

        it('should set the text used for the show button', function () {
            testElement.hideShow({
                showText: 'Collapse Search'
            });
            testElement.siblings('button').trigger('click');
            expect(testElement.siblings('button').text()).toBe('Collapse Search');
        });

        it('should set the class on the button when the content is expanded', function () {
            testElement.hideShow({
                buttonExpandedClass: 'expanded'
            });
            expect(testElement.siblings('button').hasClass('expanded')).toBe(true);
        });

        it('should remove the hidden class from the content and add a visible class to it when the button is clicked', function () {
            testElement.hideShow({
                visibleClass: 'content-visible',
                hiddenClass: 'content-hidden'
            });
            testElement.siblings('button').trigger('click');
            testElement.siblings('button').trigger('click');
            expect(testElement.hasClass('content-hidden')).toBe(false);
            expect(testElement.hasClass('content-visible')).toBe(true);
        });

        it('should remove the visible class from the content and add a hidden class to it when the button is clicked', function () {
            testElement.hideShow({
                visibleClass: 'content-visible',
                hiddenClass: 'content-hidden'
            });
            testElement.siblings('button').trigger('click');
            expect(testElement.hasClass('content-visible')).toBe(false);
            expect(testElement.hasClass('content-hidden')).toBe(true);
        });

        beforeEach(function () {
            spyOn(jQuery.fn, 'slideUp');
            spyOn(jQuery.fn, 'slideDown');
        });

        it('should set the speed at which the content is hidden/shown', function () {
            testElement.hideShow();
            testElement.siblings('button').trigger('click');
            expect(jQuery.fn.slideUp).toHaveBeenCalledWith('slow');
            testElement.siblings('button').trigger('click');
            expect(jQuery.fn.slideDown).toHaveBeenCalledWith('slow');
        });

        it('should set the trigger element as a button', function () {
            testElement.hideShow({
                triggerType: false
            });
            expect(testElement.siblings('button')).toBeDefined();
        });

        it('should set the trigger element as an anchor', function () {
            testElement.hideShow({
                triggerType: true
            });
            expect(testElement.siblings('a')).toBeDefined();
            expect(testElement.siblings('a').attr('role')).toBe('button');
        });
    });

    describe('- click function', function () {

        beforeEach(function () {
            testElement.hideShow();
            spyOn(jQuery.fn, 'slideUp');
            spyOn(jQuery.fn, 'slideDown');
        });

        it('- should toggle the help content area when the help content button is clicked', function () {
            var button = testElement.siblings('button');
            button.trigger('click');
            expect(jQuery.fn.slideUp).toHaveBeenCalledWith('slow');
            button.click();
            expect(jQuery.fn.slideDown).toHaveBeenCalledWith('slow');
        });

        it('- should toggle the aria-expanded attribute when the button is clicked depending on the state of the content', function () {
            var button = testElement.siblings('button');
            button.trigger('click');
            expect(testElement.attr('aria-expanded')).toBe('false');
            button.trigger('click');
            expect(jQuery.fn.slideUp).toHaveBeenCalled();
            expect(testElement.attr('aria-expanded')).toBe('true');
        });

    });

    describe('- plugin destroy', function () {

        it('should unwrap the help content and remove the trigger element when destroyed', function () {
            testElement.hideShow();
            var sibling;
                parent;

            testElement.data('plugin_hideShow').destroy();
            sibling = testElement.siblings('button');
            parent = testElement.parent('.content-wrap');

            expect(sibling.length).toBe(0);
            expect(parent.length).toBe(0);
        });

    });

});