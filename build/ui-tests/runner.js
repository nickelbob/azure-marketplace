var require = patchRequire(require);
var dateFormat = require("dateformat");
var config = require('../.test.json');

var azureLogin = require('./lib/azure-login');
var uiBlade = require('./lib/ui-definition-blade');
var basicDetails = require('./lib/basic-details');
var clusterSettings = require('./lib/cluster-settings');

//these are casperjs defaults but solidifying them here because
//we rely on the login served at this resolution
casper.options.viewportSize = {width: 400, height: 300};

// up the wait timeout from the default 5s to 20s
casper.options.waitTimeout = 20000;

var runDate = dateFormat(new Date(), "-yyyymmdd-HHMMss-Z").replace("+","-");

var screenshot = function(name, done)
{
  casper.viewport(1600, 950);
  casper.wait(100); //viewport then() very flakey :(
  // "../../dist/test-runs/ui-tests" + runDate + "/" + 
  casper.capture("screenshots/" + name + ".png");
  if (done) done();
}

var failures = 0;
casper.test.on("fail", function(failure) {
  screenshot("failure-" + (++failures))
});

// casper.on('remote.message', function(msg) {
//     this.echo('remote message caught: ' + msg);
// });

casper.on('page.error', function (msg, trace) {
    this.echo('Error: ' + msg, 'ERROR');
});

casper.test.begin('Can login to azure portal', 2, function suite(test) {
    azureLogin.login(config.azure.username, config.azure.password);

    casper.run(function() {
      test.assertTitle("Dashboard");
      test.assertUrlMatch(/https:\/\/portal.azure.com/);
      screenshot("dashboard", function () { test.done(); });
    });
});

casper.test.begin('Can load development UI definition blade', 2, function suite(test) {
    uiBlade.loadDevelopmentUI();

    casper.run(function() {
      test.assertTitleMatch(/^Basics - Microsoft Azure/);
      test.assertUrlMatch(/https:\/\/portal.azure.com/);
      screenshot("basics blade", function() { test.done(); });
    });
});

casper.test.begin('Can fill in Basics blade', 1, function suite(test) {
    var basicDetailsForm = basicDetails.form();

    basicDetailsForm.fill({
      username: config.deployments.username,
      password: config.deployments.password,
      resourceGroup: "russ-test",
      location: "Australia Southeast"
    });

    basicDetailsForm.submit();

    casper.run(function() {
      test.assertTitleMatch(/^Cluster Settings - Microsoft Azure/);
      screenshot("cluster settings blade", function() { test.done(); });
    });
});

casper.test.begin('Can fill in Cluster Settings blade', 1, function suite(test) {
    var clusterSettingsForm = clusterSettings.form();

    clusterSettingsForm.fill({
      esVersion: "v2.4.0",
      clusterName: "elasticsearch"
    });

    clusterSettingsForm.submit();

    casper.run(function() {
      test.assertTitleMatch(/^Nodes Configuration - Microsoft Azure/);
      screenshot("nodes configuration blade", function() { test.done(); });
    });
});

