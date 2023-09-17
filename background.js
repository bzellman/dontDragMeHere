// background.js

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ blockedUrls: [] });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    chrome.storage.sync.get(["blockedUrls"], (data) => {
      // Safeguard against undefined blockedUrls
      const urlsToBlock = data.blockedUrls || [];
    //   const isActive = urlsToBlock.some((url) => tab.url.includes(url));
    //   updateIcon(tabId, isActive);
      urlsToBlock.forEach((url) => {
        if (tab.url.includes(url)) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: blockClickAndDrag,
          });
        }
      });
    });
  }
});

function updateIcon(tabId, isActive) {
//   let path = isActive ? "icon-red.png" : "icon-gray.png";

  chrome.action.setIcon({ path, tabId });
}

function blockClickAndDrag() {
  let mouseIsDown = false;

  document.addEventListener(
    "mousedown",
    () => {
    //   console.log("Mouse down event triggered. Setting mouseIsDown to true.");
      mouseIsDown = true;
    },
    true
  );

  document.addEventListener(
    "mouseup",
    () => {
    //   console.log("Mouse up event triggered. Setting mouseIsDown to false.");
      mouseIsDown = false;
    },
    true
  );

  document.addEventListener(
    "mousemove",
    (event) => {
    //   console.log(`Mouse move event triggered. mouseIsDown is ${mouseIsDown}`);
      if (mouseIsDown) {
        console.log("Attempting to block mouse move.");
        alert("Drag action is not allowed here.");
         const mouseUpEvent = new Event("mouseup", {
           bubbles: true,
           cancelable: false,
         });
         document.dispatchEvent(mouseUpEvent);
        mouseIsDown = false; // Reset the flag since the alert will likely result in a mouseup event that doesn't get captured
      } 
    },
    true
  );
}