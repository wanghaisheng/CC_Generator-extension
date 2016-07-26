// Saves options to chrome.storage.sync.
function save_options() {
  var customNumbers = document.getElementById('custom-numbers').value;
  var newNumberOnLoad = document.getElementById('new-number-toggle').checked;
  chrome.storage.sync.set({
    customNumbers: customNumbers.replace(/[^\d\n]|^\s*$|\n$/gm, '').split('\n'),
    newNumberOnLoad: newNumberOnLoad
  }, function () {
    // Update status to let user know options were saved.
    var status = document.getElementById('save-status');
    status.textContent = 'Options saved';
    setTimeout(function () {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    customNumbers: [],
    newNumberOnLoad: true
  }, function (items) {
    document.getElementById('custom-numbers').value = items.customNumbers.toString().replace(/,/g, '\n');
    document.getElementById('new-number-toggle').checked = items.newNumberOnLoad;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

document.getElementById("custom-numbers").addEventListener("keypress", function (e) {
  if ((e.which < 48 || e.which > 57) && e.which != 13) {
    e.preventDefault();
  }
});

document.getElementById("custom-numbers").addEventListener("keyup", function (e) {
  this.value = this.value.replace(/[^\d\n]|^\s*$/gm, '');
});