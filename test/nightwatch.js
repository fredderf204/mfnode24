module.exports = {
  'Demo test' : function (browser) {
    client
      .url('http://rBuxmfnode22feat100.azurewebsites.net')
      .waitForElementVisible('body', 1000);
      //.waitForElementVisible('table', 1000)
  },
  
    afterEach: function(client, done) {
        client.customSauceEnd(done);
    }

};