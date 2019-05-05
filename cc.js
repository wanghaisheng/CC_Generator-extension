var ccIssuer;
var issuer;
var ccNumber;
var copy;
var refresh;
var newNumberOnLoad;
var loadedCC;
var setNumbersText = "Set numbers in options";
var optionsLink;

function addListeners() {
  ccIssuer.addEventListener('change', function () {
    issuer = ccIssuer.options[ccIssuer.selectedIndex].value;
    getCCNumber(issuer, function (cardNumber) {
      ccNumber.value = cardNumber;
    });
    chrome.storage.sync.set({ 'selected_issuer': issuer });
  });

  ccNumber.addEventListener('click', function () {
    if (ccNumber.value == setNumbersText) {
      chrome.runtime.openOptionsPage();
    }
    else {
      ccNumber.select();
    }
  });

  copy.addEventListener('click', function () {
    ccNumber.select();
    document.execCommand('copy');
    window.close();
  });

  refresh.addEventListener('click', function () {
    issuer = ccIssuer.options[ccIssuer.selectedIndex].value;
    getCCNumber(issuer, function (cardNumber) {
      ccNumber.value = cardNumber;
    });
  });

  optionsLink.addEventListener('click', function () {
    chrome.runtime.openOptionsPage();
  });
}

document.addEventListener('DOMContentLoaded', function () {
  ccIssuer = document.getElementById("cc_issuer");
  ccNumber = document.getElementById("cc_number");
  copy = document.getElementById("copy");
  refresh = document.getElementById("refresh");
  optionsLink = document.getElementById("options-link");

  chrome.storage.sync.get({
    newNumberOnLoad: true,
    loadedCC: 0,
    issuer: 'amex',
    selected_issuer: false,
  }, function (items) {
    newNumberOnLoad = items.newNumberOnLoad;
    loadedCC = items.loadedCC;
    issuer = items.selected_issuer;

    if (issuer) {
      document.querySelector('#cc_issuer [value="' + issuer + '"]').selected = true;
    }
    else {
      issuer = ccIssuer.options[ccIssuer.selectedIndex].value;
    }

    chrome.storage.sync.set({ selected_issuer: issuer });

    if (loadedCC == 0 || newNumberOnLoad) {
      getCCNumber(issuer, function (cardNumber) {
        ccNumber.value = cardNumber;
      });
      return;
    }

    ccNumber.value = loadedCC;
  });

  addListeners();

}, false);
