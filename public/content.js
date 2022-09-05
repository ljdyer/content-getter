// Get actions from actions.json
fetch(chrome.runtime.getURL('/actions.json'))
  .then((resp) => resp.json())
  .then(function (respJson) {
    actions = respJson;
  });


// Get default action from storage
chrome.storage.sync.get({
  defaultAction: ""
}, function (items) {
  defaultAction = items.defaultAction;
  if (defaultAction === ""){
    defaultAction = actions[0].id;
  }
  console.log("Default action is: " + defaultAction);
});


// Handle messages from the background script
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    msg = request.message;
    console.log('Received message: ' + msg);
    sendResponse('Message received');
    if (msg === "default_action") {
      actionId = defaultAction;
    } else {
      actionId = msg;
    }
    var action = actions.find(obj => {
      return obj.id === actionId;
    });
    console.log("Performing action: " + action.id);
    performAction(action);
  }
);


function performAction(action) {
  /**
   * Perform the given action
   * @param {object} action The action to perform
   */
  if (action.hasOwnProperty('source')){
    source = action.source
  } else {
    throw new Error(`Action ${action.id} does not have source property`)
  }
  if (action.hasOwnProperty('target')){
    target = action.target
  } else {
    throw new Error(`Action ${action.id} does not have target property`)
  }
  if (typeof source === 'object' & target === "word"){
    idTextToWord(action.source);
  }
}


function idTextToWord(ids){
  let text = ids.map(getElementText);
  let textWithBlankLines = intersperse(text, "");
  let lines = textWithBlankLines.map(splitByLineBreak).flat();
  makeDoc(lines);
}


function getElementText(elementId){
  /**
   * Get the text from a DOM element
   * @param {String} elementId The id of the element to get text from
   * @return {String} The text from the element
   */
  $element = $(`#${elementId}`)
  if (!($element.length)){
    throw new Error(`This page does not have an element with id ${elementId}`);
  }
  let elementText = $element.text().trim();
  return elementText;
}


function splitByLineBreak(text){
  /**
   * Split a string by line break characters
   * @param {String} text The input text
   * @return {Array.<String>} An array of lines from the input text
   */
  let result = text.split("\n");
  return result;
}

function intersperse(array, seperator){
  /**
   * Place the seperator between every adjacent element in the input array
   * @param {Array} array The array to add elements to
   * @param {*} seperator The element to interperse
   * @return {Array} The interspersed array
   */
  result = array.flatMap(e => [seperator,e]).slice(1);
  return result;
}


function makeDoc(lines){
  /**
   * Generate a Word document containing the text provided
   * @param {Array} lines An array of lines of text
   */
  let paragraphs = lines.map(paragraphFromText);
  const doc = new docx.Document({
    sections: [
      {
        properties: {},
        children: paragraphs
      }
    ]
  });
  docx.Packer.toBlob(doc).then((blob) => {
    console.log(blob);
    let filename = generateFilename();
    saveAs(blob, filename);
    console.log("Document created successfully");
  });
}


function paragraphFromText(text){
  /**
   * Generate a docx paragraph from a string
   * @param {String} text The text to include in the paragraph
   * @return {docx.Paragraph} The generated paragraph
   */
  result = new docx.Paragraph({
    children: [
      new docx.TextRun({ text: text, break: 0 }),
    ]
  });
  return result;
}


function generateFilename(){
  /**
   * Generate a filename for a new Word document
   * @return {String} The filename
   */
  let docTitle = document.title;
  let filename = `${docTitle.substring(0,10)} ${nowTimestamp()}.docx`;
  return filename;
}


function nowTimestamp(){
  /**
   * Return the current time & date formatted as a timestamp
   * @return {String} the current time & date
   */
  var today = new Date();
  var y = today.getFullYear();
  // JavaScript months are 0-based.
  var m = today.getMonth() + 1;
  var d = today.getDate();
  var h = today.getHours();
  var mi = today.getMinutes();
  var s = today.getSeconds();
  return y + "-" + m + "-" + d + " " + h + "-" + mi + "-" + s;
}


