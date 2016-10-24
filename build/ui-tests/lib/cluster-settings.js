var require = patchRequire(require);
var mouse = require("mouse").create(casper);
var azureForm = require('azureForm');
  
exports.form = function () {
    return {
        fill: function(clusterSettings) {
            azureForm.sendValueForLabel("Elasticsearch version", clusterSettings.esVersion);
            azureForm.sendValueForLabel("Cluster name", clusterSettings.clusterName);

            // expand Subnet blade
            casper.then(function () {
                this.evaluate(function() {
                    window.$("label:contains('Subnet')").click();
                });
                this.echo("clicked Subnet")
                this.waitFor(function () {
                    return this.evaluate(function() {
                        return window.$("h2:contains('Subnet')").length == 1;
                    });
                });
            });

            // ok button on Subnet blade
            casper.then(function () {
                this.evaluate(function () {
                    window.$(".fxs-bladeActionBar-content button:last").click();
                });
            });

            casper.then(function () {
                this.waitFor(function () {
                    return this.evaluate(function() {
                        return window.$("h2:contains('Subnet')").length == 0;
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
                casper.waitForSelectorText(".fxs-blade-title-titleText:last-of-type", "Nodes Configuration", function() {
                    casper.waitUntilVisible(".fxs-blade-title-titleText", function () {
                        casper.waitWhileVisible(".fxs-blade-progress-translucent");
                    });
                });
            });
        }
    }
}