// Saves options to chrome.storage
function saveDefaultAction() {
  var selectedId = $('#default-action-select').children(":selected").val();
  chrome.storage.sync.set({
    defaultAction: selectedId,
  }, function() {
    console.log('Saved new default action: ' + selectedId);
  });
}


function initOptions() {
  populateDefaultActionSelect();
}


function populateDefaultActionSelect() {
  fetch(chrome.runtime.getURL('/actions.json'))
    .then((resp) => resp.json())
    .then(function (actions) {
      actions.forEach(function(action) {
        $('#default-action-select').append(
          $('<option>', { value: action.id, text: action.displayName })
        );
      });
    })
    .then(setSelectedElement);
}


function setSelectedElement() {
  chrome.storage.sync.get({
    defaultAction: ""
  }, function (items) {
    defaultAction = items.defaultAction;
    console.log("Read default action from storage: " + defaultAction);
    if (defaultAction === "") {
      $('#default-action-select>option:eq(0)').attr('selected', 'selected');
      saveDefaultAction();
    } else {
      console.log($(`#default-action-select option[value=${defaultAction}]`))
      $(`#default-action-select [value=${defaultAction}]`).attr('selected', 'selected');
    }
  });
  $("#default-action-select").change(saveDefaultAction);
}


document.addEventListener('DOMContentLoaded', initOptions);