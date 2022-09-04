// Store 
fetch(chrome.runtime.getURL('/actions.json'))
  .then((resp) => resp.json())
  .then(function (respJson) {
    actions = respJson;
  });


// Handle messages from the background script
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    msg = request.message;
    console.log('Received message: ' + msg);
    var action = actions.filter(obj => {
      return obj.id === msg;
    });
    console.log(action);
    sendResponse('Message received');
  }
);


// function getAllText(storageItems){
//   let list = storageItems.idList;

//   let elementIds = splitAndTrim(list);
//   let elementText = elementIds.map(getElementText);
//   let elementTextWithBlankLines = intersperse(elementText, "");
//   let lines = elementTextWithBlankLines.map(splitByLineBreak).flat();

//   console.log(lines);
//   makeDoc(lines);
// }

// function getElementText(elementId){
//   let elementText = $(`#${elementId}`).text().trim();
//   return elementText;
// }

// function splitAndTrim(commaList){
//   result = commaList.split(",").map(trimString);
//   return result;
// }

// function splitByLineBreak(text){
//   let result = text.split("\n");
//   return result;
// }

// function intersperse(array, seperator){
//   result = array.flatMap(e => [seperator,e]).slice(1);
//   return result;
// }

// function trimString(string){
//   return string.trim();
// }

function makeDoc(text){
  /**
   * Generate a Word document containing the text provided
   * !!! @param {String} text The text to include in the Word document
   */
  let paragraphs = text.map(paragraphFromText);
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


