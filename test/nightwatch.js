module.exports = {
  'Demo test' : function (browser) {
    browser
      .url('http://google.com')
      .waitForElementVisible('body', 1000);
      //.waitForElementVisible('table', 1000)
  },

};