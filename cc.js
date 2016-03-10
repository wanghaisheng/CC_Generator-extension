
var num_digits = 16;
var digits = [];

digits[0] = 4;
digits[num_digits - 1] = 'p';

for (var i = num_digits - 2; i > 0; i--) {
  digits[i] = Math.floor(Math.random() * (9));
}

var sum = 0;
var count = 1;
for (var i = num_digits - 2; i >= 0; i--) {
  if (count % 2 != 0) {
    var num = digits[i] * 2;
    if(num >= 10) {
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
console.log(digits.join(""));
