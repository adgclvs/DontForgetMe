chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({ urls: [] }, function() {
        console.log("Initialized URL storage.");
    });
});