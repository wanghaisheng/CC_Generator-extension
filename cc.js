document.addEventListener('DOMContentLoaded', function () {
  var e = document.getElementById("cc_issuer");
  var issuer = e.options[e.selectedIndex].value;
  document.getElementById("cc_number").innerHTML = getCCNumber(issuer);
  e.addEventListener('change', function(){
    var e = document.getElementById("cc_issuer");
    var issuer = e.options[e.selectedIndex].value;
    document.getElementById("cc_number").innerHTML = getCCNumber(issuer);
  });
}, false);

function getCCNumber(issuer) {
  var digits = [];
  var num_digits = 0;
  switch (issuer) {
    case "visa":
      num_digits = Math.floor(Math.random() * (16-13) + 13);
      digits[0] = 4;
      break;
    case "mastercard":
      num_digits = 16;
      digits[0] = 5;
      digits[1] = Math.floor(Math.random() * (5-1) + 1);
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
    digits[i] = Math.floor(Math.random() * (9));
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
