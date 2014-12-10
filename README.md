# jQuery Hide / Show [![Build Status](https://travis-ci.org/nomensa/jquery.hide-show.svg)](https://travis-ci.org/nomensa/jquery.hide-show.svg?branch=master)

> Inserts an accessible buttons/links to hide and show sections of content.


## Usage

To get started you can either:

 - Clone the repo: `git clone https://github.com/nomensa/jquery.hide-show.git`
 - Or install with Bower: `bower install jquery.hide-show`

Then it's just a case of including the following scripts on your page, best at the bottom:

```html
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  <script src="jquery.hideShow.min.js"></script>
```


## Options & Defaults

### buttonClass

Type: `string`

Default: 'js-hide-show_btn'

Description: The class which is added to the button for styling purposes

### buttonCollapsedClass

Type: `string`

Default: 'js-hide-show_btn--collapsed'

Description: The class name applied to the button when the element is collapsed

### buttonExpandedClass

Type: `string`

Default: 'js-hide-show_btn--expanded'

Description: The class name applied to the button when the element is expanded

### callbackCreate

Type: `function`

Description: Callback when the plugin is created

### callbackDestroy

Type: `function`

Description: Callback when the plugin is destroyed

### containerClass

Type: `string`

Default: 'js-hide-show_content'

Description: The class for the element to be hidden/shown

### containerCollapsedClass

Type: `string`

Default: 'js-hide-show_content--collapsed'

Description: The class which is added to the content when it is collapsed

### containerExpandedClass

Type: `string`

Default: 'js-hide-show_content--visible'

Descritpion: The class which is added to the content when it is expanded

### hideText

Type: `string`

Default: 'Hide Content'

Description: The text for the button that hides the content

### insertMethod

Type: `string`

Default: 'before'

Description: Method that is used to insert the trigger button into the location, options are `'after'`, `'append'`, `'before'` and `'prepend'`. Only to be used with the insertTriggerLocation option.

### insertTriggerLocation

Type:`string`

Description: Defines if the generated trigger element should be inserted to somewhere other than directly before the element

### showText

Type: `string`

Default: 'Show Content'

Description: The text for the button that shows the content

### speed

Type: `string` or `number`

Default: 'slow'

Description: Takes the same value as the duration option for jQuery's slideUp and slideDown functions

### state

Type: `string`

Default: 'shown'

Description: Sets whether the element is hidden or shown by default, options are `'hidden'` and `'shown'`

### triggerElementTarget

Type: `string`

Description: Defines if an existing element should act as the trigger element


## Development

This plugin requires:

 - [node.js](http://nodejs.org/) `~0.10.x`
 - [Grunt](http://gruntjs.com/) `~0.4.0`
 - [jQuery](http://jquery.com) `~v1.9.x`

### Node
First time setup of this plugin will require the node packages to be installed. On Windows use the command prompt with Ruby or on a Mac use terminal, install the global node.js packages:

```bash
$npm install
```

### Grunt
If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to install and use Grunt.

You will need to install the Grunt CLI (command line interface):

```bash
$ npm install -g grunt-cli
# => if you have used grunt before you probably have this (this can be run from any directory)
```

Next install the plugin's node packages:

```bash
$ npm install
```

### Watcher

Running grunt (with watcher) will watch for any changes and recompile - best used during development:

```bash
$ grunt
```

#### Connect server (optional)

You can run a connect web server on `http://0.0.0.0:9001`, if required, when running grunt:

```bash
$ grunt --connect
# => Running "connect:server" (connect) task
# => Started connect web server on http://0.0.0.0:9001

# => Running "watch" task
# => Waiting...
```

Copyright &copy; 2014 [@nomensa](http://nomensa.com)

Licensed under [MIT](http://opensource.org/licenses/mit-license.php)