document.addEventListener('DOMContentLoaded', function () {
  var cc_issuer = document.getElementById("cc_issuer");
  var issuer = cc_issuer.options[cc_issuer.selectedIndex].value;
  var cc_number = document.getElementById("cc_number");
  var copy = document.getElementById("copy");
  var refresh = document.getElementById("refresh");


  cc_number.value = getCCNumber(issuer);

  cc_issuer.addEventListener('change', function(){
    issuer = cc_issuer.options[cc_issuer.selectedIndex].value;
    cc_number.value = getCCNumber(issuer);
  });

  cc_number.addEventListener('click', function() {
    cc_number.select();
  });

  copy.addEventListener('click', function() {
    cc_number.select();
    document.execCommand('copy');
    window.close();
  });

  refresh.addEventListener('click', function() {
    issuer = cc_issuer.options[cc_issuer.selectedIndex].value;
    cc_number.value = getCCNumber(issuer);
  });

}, false);

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
      digits[1] = Math.floor(Math.random() * (5-1 + 1) + 1); // Digit between 1 and 5
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
  return digits.join("");
}

function selectText(element) {
  var doc = document
    , text = doc.getElementById(element)
    , range, selection
    ;
  if (doc.body.createTextRange) {
    range = document.body.createTextRange();
    range.moveToElementText(text);
    range.select();
  } else if (window.getSelection) {
    selection = window.getSelection();
    range = document.createRange();
    range.selectNodeContents(text);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
