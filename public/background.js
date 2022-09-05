// Extension icon click action
chrome.action.onClicked.addListener(function(tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { "message": "default_action" }, function(response) {
      console.log('Sent message: ' + info)
    });
  });
});

// Handle messages from content script
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "open_new_tab" ) {
      chrome.tabs.create({"url": request.url});
    }
  }
);

// Add context menu items
chrome.runtime.onInstalled.addListener(function() {
  fetch(chrome.runtime.getURL('/actions.json'))
    .then((resp) => resp.json())
    .then(function(actions){
      actions.forEach(item =>
        chrome.contextMenus.create(
          { id: item.id, title: item.displayName, contexts: item.contexts }
        )
      )
    });
});

// Handle context menu clicks
function contextClick(info, tab) {
  clickedId = info.menuItemId
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { "message": clickedId }, function (response) {
        console.log('Sent message: ' + info.clickedId);
    });
  });
}

chrome.contextMenus.onClicked.addListener(contextClick)