var ccIssuer;
var issuer;
var ccNumber;
var copy;
var refresh;
var customNumbers;
var newNumberOnLoad;
var loadedCC;
var setNumbersText = "Set numbers in options";
var optionsLink;
var autoCompleteNumber;
var autoCompleteNumberLength;

document.addEventListener('DOMContentLoaded', function () {
  ccIssuer = document.getElementById("cc_issuer");
  ccNumber = document.getElementById("cc_number");
  copy = document.getElementById("copy");
  refresh = document.getElementById("refresh");
  optionsLink = document.getElementById("options-link");

  chrome.storage.sync.get({
    customNumbers: [],
    newNumberOnLoad: true,
    loadedCC: 0,
    selected_issuer: false,
    autoCompleteNumber: false,
    autoCompleteNumberLength: 13
  }, function (items) {
    customNumbers = items.customNumbers;
    newNumberOnLoad = items.newNumberOnLoad;
    loadedCC = items.loadedCC;
    issuer = items.selected_issuer;
    autoCompleteNumber = items.autoCompleteNumber;
    autoCompleteNumberLength = items.autoCompleteNumberLength;

    if (issuer) {
      document.querySelector('#cc_issuer [value="' + issuer + '"]').selected = true;
    }
    else {
      issuer = ccIssuer.options[ccIssuer.selectedIndex].value;
    }

    if (loadedCC == 0 || newNumberOnLoad) {
      loadedCC = getCCNumber(issuer);
    }

    ccNumber.value = loadedCC;
  });

  addListeners();

}, false);

function addListeners() {
  ccIssuer.addEventListener('change', function () {
    issuer = ccIssuer.options[ccIssuer.selectedIndex].value;
    ccNumber.value = getCCNumber(issuer);
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
    ccNumber.value = getCCNumber(issuer);
  });

  optionsLink.addEventListener('click', function () {
    chrome.runtime.openOptionsPage();
  });
}

function getCCNumber(issuer) {
  var digits = [];
  var num_digits = 0;
  switch (issuer) {
    case "visa":
      num_digits = 13 + 3 * Math.floor(Math.random() * (1 + 1));  // Get's either 13 or 16
      digits[0] = 4;
      break;
    case "mastercard":
      num_digits = 16;
      digits[0] = 5;
      digits[1] = Math.floor(Math.random() * (5 - 1 + 1) + 1); // Digit between 1 and 5
      break;
    case "discover":
      num_digits = 16;
      digits[0] = 6;
      digits[1] = 0;
      digits[2] = 1;
      digits[3] = 1;
      break;
    case "amex":
      num_digits = 15;
      digits[0] = 3;
      if (Math.random() < 0.5) {
        digits[1] = 4;
      } else {
        digits[1] = 7;
      }
      break;
    case "custom":
      if (autoCompleteNumber) {
        num_digits = autoCompleteNumberLength;
        var number = getCustomValue();

        digits = number.toString().split("");
        for (var i = 0; i < digits.length; i++) {
          digits[i] = parseInt(digits[i]);
        }
        if (digits.length >= num_digits) {
          // make sure the number isn't greater then max set length
          // also make sure there's room for the check digit
          digits = digits.slice(0, num_digits - 1);
        }
      }
      else {
        return getCustomValue();
      }
  }

  digits[num_digits - 1] = 'p';

  for (var i = num_digits - 2; i >= 0 && digits[i] == null; i--) {
    digits[i] = Math.floor(Math.random() * (9 + 1));
  }

  var sum = 0;
  var count = 1;
  for (i = num_digits - 2; i >= 0; i--) {
    if (count % 2 != 0) {
      var num = digits[i] * 2;
      if (num >= 10) {
        num -= 9;
      }
      sum += num;
    }
    else {
      sum += digits[i];
    }
    count++;
  }
  digits[num_digits - 1] = (-(sum % 10) + 10) % 10;

  var newCC = digits.join("");
  chrome.storage.sync.set({ loadedCC: newCC });
  return newCC;
}

function getCustomValue() {
  var numCount = customNumbers.length;
  var newCC = 0;
  if (numCount <= 0 || (numCount == 1 && customNumbers[0] == '')) {
    newCC = setNumbersText;
  }
  else {
    newCC = customNumbers[Math.floor(Math.random() * numCount)];
  }

  chrome.storage.sync.set({ loadedCC: newCC });
  return newCC;
}
