// Called when the user clicks on the browser action.
chrome.action.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { "message": "clicked_browser_action" }, function(response) {
      console.log('Sent message.')
    });
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "open_new_tab" ) {
      chrome.tabs.create({"url": request.url});
    }
  }
);

chrome.runtime.onInstalled.addListener(function() {
  fetch(chrome.runtime.getURL('/actions.json'))
    .then((resp) => resp.json())
    .then(function(actions){
      actions.forEach(item =>
        chrome.contextMenus.create(
          { id: item.id, title: item.displayName, contexts: item.contexts }
        )
      )
    })
})

function contextClick(info, tab) {
  const { menuItemId } = info
  if (menuItemId === 'foo') {
    console.log('foo')
  }
}

chrome.contextMenus.onClicked.addListener(contextClick)