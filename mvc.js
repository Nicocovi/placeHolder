function newPositioningFunction(){
    var arrayWithPlaceHolders = $('.placeHolder').toArray();
    $(":input").not('.placeHolder').each(function(i) {
        var coordinates = $(this).position();
        var borderWidthDifference = $(this).outerWidth()-$(this).innerWidth();
        var borderHeightDifference = $(this).outerHeight()-$(this).innerHeight();
        // immer 3px
        $(arrayWithPlaceHolders[i]).css('position', 'absolute');
        $(arrayWithPlaceHolders[i]).css('top', coordinates.top);
        $(arrayWithPlaceHolders[i]).css('left', coordinates.left);
    });
}
 
function createPlaceholderInput($originalInput) {
    //TODO create placeholder input element and move it above $originalInput, you can use $originalInput.offset() to get x,y coordinates
    var coordinates = $originalInput.position();
 
    var $placeholderInstance = $("<input type='text'/>");
    $placeholderInstance.attr('type','text');
    (function($) {
        $.fn.getStylesFromObject = function () {
            var dom = this.get(0);
            var style;
            var returnArray = {};
            if (window.getComputedStyle) {
                var c = function (a, b) {
                    return b.toUpperCase();
                };
                style = window.getComputedStyle(dom, null);
                for (var i = 0, l = style.length; i < l; i++) {
                    var prop = style[i];
                    var m = prop.replace(/\-([a-z])/g, c);
                    var val = style.getPropertyValue(prop);
                    returnArray[m] = val;
                }
                return returnArray;
            }
            if (style = dom.currentStyle) {
                for (var prop in style) {
                    returnArray[prop] = style[prop];
                }
                return returnArray;
            }
            return this.css();
        }
    })(jQuery);
    var styles = $originalInput.getStylesFromObject();
    $placeholderInstance.css(styles);
 
    $placeholderInstance.css('position', 'absolute');
    var borderWidthDifference = Math.ceil(($originalInput.outerWidth()-$originalInput.innerWidth())/2);
    var borderHeightDifference = Math.ceil(($originalInput.outerHeight()-$originalInput.innerHeight())/2);
 
    //immer 3px
    $placeholderInstance.css('top', coordinates.top);
    $placeholderInstance.css('left', coordinates.left);
    $placeholderInstance.appendTo($originalInput.parent());
 
    $placeholderInstance.addClass('placeHolder');
 
    console.log("Coordinates-Left: "+coordinates.left+", Placeholder-Left: "+$placeholderInstance.position().left);
    console.log("Coordinates-Top: "+coordinates.top+", Placeholder-Top: "+$placeholderInstance.position().top);
    console.log("OriginalInput-Width: "+$originalInput.css('width')+", Placeholder-Width: "+$placeholderInstance.css('width'));
    console.log("OriginalInput-Height: "+$originalInput.css('height')+", Placeholder-Height: "+$placeholderInstance.css('height'));
    console.log("BorderDifference-Height: "+borderHeightDifference+", Border-Difference-Width: "+borderWidthDifference);
    console.log("-------------------------------------------------------------------------------------");
 
    return $placeholderInstance; //TODO return placeholder instance
}
 
ko.bindingHandlers.placeholder = {
 
    init: function(element, valueAccessor, allBindingsAccessor) {
 
        var value = valueAccessor(), allBindings = allBindingsAccessor();
        var placeholder = ko.utils.unwrapObservable(value);
        var $originalInput = $(element);
 
        if(Modernizr.input.placeholder){
            alert("This Browser supports placeholder");
            $originalInput.attr('placeholder', placeholder);
        }else{
            alert("This Browser does not support placeholder");
            var $placeholderInput = createPlaceholderInput($originalInput);
            //TODO set value of placeholderInput to placeholder text
            $placeholderInput.val(placeholder);
 
            $placeholderInput.on('focus', function() {
                //TODO hide placeholder and focus originalInput
                $placeholderInput.hide();
                $originalInput.focus();
            });
 
            $originalInput.on('blur', function() {
                //TODO if value === '' then show placeholderInput
                if($originalInput.val()===""){
                    $placeholderInput.show();
                }
            });
        }
    }//Ende init
}
 
 
 
 
viewModel =  function () {
 
    document.hasFocus(null);
 
    this.inputEmail = ko.observable();
    this.inputPassword = ko.observable();
 
    $( window ).resize(function() {
        //alert('Window wurde resized');
        newPositioningFunction();
    });
 
};
 
viewModelInstance = new viewModel(); //creates an instance of viewModel
 
// Activates knockout.js
ko.applyBindings(viewModelInstance);