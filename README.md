# jq
My (minimal) jQuery-like lib (IE9+) 1.4k zipped

## API

### `post(url, data, successCallback, failCallback)`
jQuery-like ajax (only POST, only application/json, no cross-domain?)

### `$(...)`
select all elements at page by css selector
### `$('<div id="123"></div>')`
creates new element(s) (returns array)

### `$().find('div a')`
find all children of all elements by selector
### `$().remove()`
find all elements selected
### `$().show() / $().hide()`
show/hide all elements selected
### `$().click(f)`
appends new event handler (for click, dblclick, mouseover etc. - almost all events), where f is function


### `$().html('aaa') / $().html()`
set up innerHTML for all elements / (parameterless) returns innerHTML of first element 
### `$().css('color:red;font-size:20px') / $().css('font-size')`
set up css for all elements / returns css value of first element
### `$().addClass(name) / $().removeClass(name) / $().toggleClass(name)`
add/remove/toggle class at all elements selected
### `$().hasClass(name)`
whether any element has specified class?
