document.addEventListener('DOMContentLoaded', function() {
    const saveUrlButton = document.getElementById('saveUrlButton');
    const urlList = document.getElementById('urlList');

    saveUrlButton.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            const url = tabs[0].url;
            chrome.storage.sync.get({ urls: [] }, function(data) {
                const urls = data.urls;
                if (!urls.includes(url)) {
                    urls.push(url);
                    chrome.storage.sync.set({ urls: urls }, function() {
                        displayUrls();
                    });
                }
            });
        });
    });

    function displayUrls() {
        chrome.storage.sync.get({ urls: [] }, function(data) {
            urlList.innerHTML = '';
            data.urls.forEach(function(url) {
                const div = document.createElement('div');
                div.textContent = url;
                div.className = 'urlItem';
                urlList.appendChild(div);
            });
        });
    }

    displayUrls();
});