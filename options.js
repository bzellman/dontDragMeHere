document.addEventListener("DOMContentLoaded", () => {
  loadUrls();

  document.getElementById("add-url").addEventListener("click", () => {
    const newUrl = document.getElementById("new-url").value;
    addUrl(newUrl);
  });
});

function loadUrls() {
  chrome.storage.sync.get(["blockedUrls"], (data) => {
    const urlsToBlock = data.blockedUrls || [];
    urlsToBlock.forEach((url) => addUrlToList(url));
  });
}

function addUrl(newUrl) {
  chrome.storage.sync.get(["blockedUrls"], (data) => {
    const urlsToBlock = data.blockedUrls || [];
    urlsToBlock.push(newUrl);
    chrome.storage.sync.set({ blockedUrls: urlsToBlock }, () => {
      addUrlToList(newUrl);
    });
  });
}

function removeUrl(urlToRemove) {
  chrome.storage.sync.get(["blockedUrls"], (data) => {
    let urlsToBlock = data.blockedUrls || [];
    urlsToBlock = urlsToBlock.filter((url) => url !== urlToRemove);
    chrome.storage.sync.set({ blockedUrls: urlsToBlock }, () => {
      loadUrls();
    });
  });
}

function addUrlToList(url) {
  const ul = document.getElementById("url-list");
  const li = document.createElement("li");
  li.textContent = url;
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    li.remove();
    removeUrl(url);
  });
  li.appendChild(deleteButton);
  ul.appendChild(li);
}
