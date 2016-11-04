# jq
My (minimal) jQuery-like lib (with method chaining) IE9+

## API

### `post(url, data, successCallback, failCallback)`
jQuery-like ajax (only POST, only application/json, no cross-domain?) IE9+

### `$(...)`
select all elements at page by css selector
### `$('<div id="123"></div>')`
creates new element(s) (returns array)
### `$().find('div a')`
find all children of all elements by selector
### `$().html()`
returns innerHTML of first element
### `$().html('aaa')`
set up innerHTML for all elements
### `$().css('font-size')`
returns css value of first element
### `$().css('color:red;font-size:20px')`
set up css for all elements 
### `$().addClass(name)`
add class to all elements
### `$().removeClass(name)`
remove class from all elements (if any)
### `$().hasClass(name)`
whether any element has specified class?
### `$().toggleClass(name)`
toggle specified class at all elements
### `$(...).click(f)`
event handlers, like $(...).click(f) where f is function == appends new event handler
