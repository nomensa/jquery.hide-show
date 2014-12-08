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

    var markUp2 =
            '<div class="row">' +
                '<h2 class="title">Can\'t find your doctor</h2>' +
                '<p>Please call 01234 567 890.</p>' +
            '</div>',
        testElement2;

    var markUp3 =
            '<div class="row">' +
                '<h2 class="title">Can\'t find your doctor</h2>' +
                '<p>Please call 01234 567 890.</p>' +
            '</div>',
        testElement3;

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

       it('should add a class of "js-hide-show_content" to the content to be hidden', function () {
           testElement.hideShow();
           expect(testElement.hasClass('js-hide-show_content')).toBe(true);
       });

       it('should prepend the content to be hidden with a button used to hide it', function () {
           testElement.hideShow();
           expect(testElement.siblings('.js-hide-show_btn').length).toBe(1);
       });

       it('should add a class of "js-hide-show_btn" to the button', function () {
           testElement.hideShow();
           expect(testElement.siblings('button').hasClass('js-hide-show_btn')).toBe(true);
       });

       it('should set an aria-controls attribute on the button', function () {
           testElement.hideShow();
           expect(testElement.siblings('.js-hide-show_btn').attr('aria-controls')).toBeDefined();
       });

       it('should set an aria-controls attribute to be associated with the relevant content', function () {
           testElement.hideShow();
           var id = testElement.attr('id');
           expect(testElement.siblings('.js-hide-show_btn').attr('aria-controls')).toBe(id);
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
            expect(testElement.hasClass('js-hide-show_content--expanded')).toBe(true);
        });

        it('should set the default aria-expanded attribute value to true if the state is set to "shown"', function () {
            testElement.hideShow();
            expect(testElement.siblings('.js-hide-show_btn').attr('aria-expanded')).toBe('true');
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
            expect(testElement.siblings('.js-hide-show_btn').attr('aria-expanded')).toBe('false');
        });

        it('should set the text used for the hide button', function () {
            testElement.hideShow({
                hideText: 'Expand Search'
            });
            expect(testElement.siblings('.js-hide-show_btn').text()).toBe('Expand Search');
        });

        it('should set the text used for the show button', function () {
            testElement.hideShow({
                showText: 'Collapse Search'
            });
            testElement.siblings('.js-hide-show_btn').trigger('click');
            expect(testElement.siblings('.js-hide-show_btn').text()).toBe('Collapse Search');
        });

        it('should set the class on the button when the content is expanded', function () {
            testElement.hideShow({
                buttonExpandedClass: 'expanded'
            });
            expect(testElement.siblings('.js-hide-show_btn').hasClass('expanded')).toBe(true);
        });

        it('should remove the hidden class from the content and add a visible class to it when the button is clicked', function () {
            testElement.hideShow({
                containerExpandedClass: 'content-visible',
                containerCollapsedClass: 'content-hidden'
            });
            testElement.siblings('.js-hide-show_btn').trigger('click');
            testElement.siblings('.js-hide-show_btn').trigger('click');
            expect(testElement.hasClass('content-hidden')).toBe(false);
            expect(testElement.hasClass('content-visible')).toBe(true);
        });

        it('should remove the visible class from the content and add a hidden class to it when the button is clicked', function () {
            testElement.hideShow({
                containerExpandedClass: 'content-visible',
                containerCollapsedClass: 'content-hidden'
            });
            testElement.siblings('.js-hide-show_btn').trigger('click');
            expect(testElement.hasClass('content-visible')).toBe(false);
            expect(testElement.hasClass('content-hidden')).toBe(true);
        });

        beforeEach(function () {
            spyOn(jQuery.fn, 'slideUp');
            spyOn(jQuery.fn, 'slideDown');
        });

        it('should set the speed at which the content is hidden/shown', function () {
            testElement.hideShow({
                state: 'shown'
            });
            testElement.siblings('.js-hide-show_btn').trigger('click');
            expect(jQuery.fn.slideUp).toHaveBeenCalledWith('slow');
        });

        it('should set the trigger element as a button', function () {
            testElement.hideShow();
            expect(testElement.siblings('.js-hide-show_btn')).toBeDefined();
        });

        beforeEach(function () {
            testElement2 = $(markUp2);
        });

        it('should replace the chosen element with a trigger element (anchor)', function () {
            testElement2.hideShow({
                triggerType: 'anchor',
                triggerElement: true
            });
            expect(testElement2.siblings('a')).toBeDefined();
        });


    });

    describe('- click function', function () {

        beforeEach(function () {
            testElement.hideShow();
            spyOn(jQuery.fn, 'slideUp');
            spyOn(jQuery.fn, 'slideDown');
        });

        it('- should toggle the help content area when the help content button is clicked', function () {
            var button = testElement.siblings('.js-hide-show_btn');

            button.click();
            expect(jQuery.fn.slideUp).toHaveBeenCalled();
            expect(testElement.hasClass('js-hide-show_content--collapsed')).toBe(true);
            button.click();
            expect(jQuery.fn.slideDown).toHaveBeenCalled();
            expect(testElement.hasClass('js-hide-show_content--expanded')).toBe(true);
        });

        it('- should toggle the aria-expanded attribute when the button is clicked depending on the state of the content', function () {
            var button = testElement.siblings('.js-hide-show_btn');

            button.click();
            expect(button.attr('aria-expanded')).toBe('false');
            button.click();
            expect(jQuery.fn.slideUp).toHaveBeenCalled();
            expect(button.attr('aria-expanded')).toBe('true');
        });

    });

    describe('- open function', function() {

        beforeEach(function () {
            testElement3 = $(markUp3);
        });

        it('- should add a tabindex of -1 to the element if the trigger does not immediately precede it', function () {
            testElement3.hideShow({
                insertTriggerLocation: '.example'
            });

            expect(testElement3.attr('tabindex')).toBe('-1');
        });

        it('- should insert the trigger before the element if the insertMethod option is set to "before"', function () {
            $(testElement3).before('<p class="example">Insert button before this</p>');

            testElement3.hideShow({
                insertMethod: 'before',
                insertTriggerLocation: '.example'
            });

            console.log(testElement3.siblings());
            expect(testElement3.siblings('.example').prev('button')).toBe(true);
        });

    });

    describe('- plugin rebuild', function () {
        it('should add a button to the target element when the rebuild function is called', function () {
            testElement.hideShow();
            var triggerElement = testElement.siblings('.js-hide-show_btn');

            testElement.data('plugin_hideShow').destroy();
            testElement.data('plugin_hideShow').rebuild();

            expect(triggerElement.length).toBe(1);
        });
    });

    describe('- plugin destroy', function () {

        it('should remove user specific classes from the element', function () {
            testElement.hideShow();

            testElement.data('plugin_hideShow').destroy();
            expect(testElement.hasClass('js-hide-show_content')).toBe(false);
            expect(testElement.hasClass('js-hide-show_content--collapsed')).toBe(false);
            expect(testElement.hasClass('js-hide-show_content--expanded')).toBe(false);
        });

        it('should remove all classes from the trigger element', function () {
            testElement.hideShow();
            var button = testElement.siblings('.js-hide-show_btn');

            testElement.data('plugin_hideShow').destroy();
            expect(button.hasClass('js-hide-show_btn')).toBe(false);
            expect(button.hasClass('js-hide-show_btn--collapsed')).toBe(false);
            expect(button.hasClass('js-hide-show_btn--expanded')).toBe(false);
        });

        it('should remove the trigger element', function () {
            testElement.hideShow();

            testElement.data('plugin_hideShow').destroy();
            expect(testElement.siblings('.js-hide-show_btn').length).toBe(0);
        });

        it('should remove the aria-hidden attribute from the element', function () {
            testElement.hideShow();

            testElement.data('plugin_hideShow').destroy();
            expect(testElement.attr('aria-hidden')).toBe(undefined);
        });

    });

});