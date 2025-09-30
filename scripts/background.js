chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({ urls: [] }, function() {
        console.log("Initialized URL storage.");
    });
});

chrome.commands.onCommand.addListener(handleCommand);

function handleCommand(command) {
    console.log("Command received:", command); // Debug log
    if (command === "save_url") {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            const url = tabs[0].url;
            console.log("Saving URL:", url); // Debug log
            saveUrl(url);
        });
    } else if (command === "delete_all") {
        chrome.storage.sync.set({ urls: [] }, function() {
            console.log("All URLs deleted"); // Debug log
            showNotification('URLs Deleted', 'All saved URLs have been deleted.');
        });
    }
}

function saveUrl(url) {
    chrome.storage.sync.get({ urls: [] }, function(data) {
        const urls = data.urls;
        if (!urls.includes(url)) {
            urls.push(url);
            chrome.storage.sync.set({ urls: urls }, function() {
                console.log("URL saved: " + url);
                showNotification('URL Saved', 'The URL has been saved successfully.');
            });
        } else {
            showNotification('URL Already Saved', 'The URL is already in the list.');
        }
    });
}

function showNotification(title, message) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: chrome.runtime.getURL('images/icon48.png'),
        title: title,
        message: message,
        requireInteraction: false
    });
}