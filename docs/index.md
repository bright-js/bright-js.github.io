# BrightJs

A tiny library for small webpages.

!!! info Note
You should consider not using it, since I will not bring any further update to it.
!!!

## Use it

The minified version is available [here](https://raw.githubusercontent.com/bright-js/bright-js.github.io/main/public/bright.min.js).


# Docs

## Select an HTMLElement

```js
const elem = $('h1');
```

## Access it's content and modify it.

```js
// Change it's HTML
$('h1').html('Hello world!');

// access to it's HTML
const html = $('h1').html();// => 'Hello world!'

// change it's content
$('h1').text('Hello world! >:)');

// access to it's content
const text = $('h1').text();// => 'Hello world! >:)'
```

**Note:** if you select many different tags, it will returns an array 

```js
var text = $('h1').text();
// => ['Hello world!', ...]
```

## Use it with an object

```js
const tag = document.getElementById('myId');
const elem = $(tag);
```

## Add an event listener

```js
$('h1').on('click', (event) => {
    $.log('Clicked!');
});
$(window).on('load', () => {
    $.log('Loaded!');
});
```

## Load external html in a tag

```js
$('myDiv')
    .load('/path/to/file.html')
    // you can execute a function when the content is loaded
    .then(() => {
        $.log('Loaded!');
    });
```

## Change some css

```js
$('h1')
    // change it's style by providing a property and a value
    .css('color', 'red')
    
    // you can also do it with an object
    .css({
        color: 'red',
        fontWeight: 'bolder'
    });
    
// access to a property
$.log($('h1').css('color'));// => 'red'

// or
$.log($('h1').css('color'));// => 'rgb(255, 0, 0)'
```