// Saves options to chrome.storage
function save_options() {
  var idList = document.getElementById('idList').value;
  chrome.storage.sync.set({
    idList: idList,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1500);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    idList: ""
  }, function(items) {
    document.getElementById('idList').value = items.idList;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);

function wikipedia(){
  document.getElementById('idList').value = "firstHeading,toc";
}

function clear(){
  document.getElementById('idList').value = "";
}

document.getElementById('clear').addEventListener('click', clear);
document.getElementById('wikipedia').addEventListener('click', wikipedia);