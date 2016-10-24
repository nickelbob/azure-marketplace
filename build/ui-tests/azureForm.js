var require = patchRequire(require);   
   
function inputSelectorFromLabelText(labelText) {
    var id = casper.evaluate(function(labelText) {
        var label = window.$("label:contains('" + labelText + "')");
        return label[0].id;
    }, labelText);

    // Azure Marketplace has a space before the id
    return "[aria-labelledby=' " + id + "']";
}

module.exports = {
    inputSelectorFromLabelText: inputSelectorFromLabelText,
    sendValueForLabel: function(selector, value) {
        var inputSelector = inputSelectorFromLabelText(selector);
        casper.thenClick(inputSelector, function() {
            // this seems to be the most reliable way to get the portal UI
            // to acknowledge a value change
            this.evaluate(function (inputSelector, value) {
                __utils__.setFieldValue(inputSelector, value);
            }, inputSelector, value);
            this.echo("Filled in value for '" + selector + "' - " + inputSelector);
        });
    }
}


