var require = patchRequire(require);
var mouse = require("mouse").create(casper);
var azureForm = require('azureForm');
  
exports.form = function () {
    return {
        fill: function(basicDetails) {
            // Resource group uses a hidden label with text "Create new resource group"
            azureForm.sendValueForLabel("Create new resource group", basicDetails.resourceGroup);
            azureForm.sendValueForLabel("User name", basicDetails.username);
            azureForm.sendValueForLabel("Password", basicDetails.password);
            azureForm.sendValueForLabel("Confirm password", basicDetails.password);
            
            //azureForm.sendValueForLabel("Location", basicDetails.location);

            // portal UI remains open on last input otherwise, so swtich to an already filled one
            var inputSelector = azureForm.inputSelectorFromLabelText("User name");
            casper.thenClick(inputSelector, function() {
                this.sendKeys(inputSelector, "");

                // ensure all inputs are valid
                this.waitFor(function () {
                    return this.evaluate(function() {
                        return document.querySelectorAll(".azc-validatableControl-valid-validated").length == 6;
                    });
                });
            });
        },
        submit: function() {
            casper.then(function() {
                this.mouse.down(".fxs-bladeActionBar-content button");
                this.echo("OK button clicked");
                this.mouse.up(".fxs-bladeActionBar-content button");
            });
            casper.then(function() {
                casper.capture("screenshots/button clicked.png");
                casper.viewport(1600, 950);
                casper.wait(10000);
                casper.capture("screenshots/after waiting.png");
            });
            casper.then(function() {
                casper.waitForSelectorText(".fxs-blade-title-titleText:last-of-type", "Cluster Settings", function() {
                    casper.waitUntilVisible(".fxs-blade-title-titleText", function () {
                        casper.waitWhileVisible(".fxs-blade-progress-translucent");
                    });
                });
            });
        }
    }
}