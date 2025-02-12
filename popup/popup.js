/**
 * Initializes the popup by setting up event listeners and displaying saved URLs.
 */
document.addEventListener('DOMContentLoaded', function() {
    const saveUrlButton = document.getElementById('saveUrlButton');
    const urlList = document.getElementById('urlList');

    /**
     * Event listener for the "Save Current URL" button.
     * Saves the current active tab's URL to Chrome storage.
     */
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

    deleteAllButton.addEventListener('click', function() {
        chrome.storage.sync.set({ urls: [] }, function() {
            displayUrls();
        });
    });

    /**
     * Displays the saved URLs in the popup.
     * Retrieves URLs from Chrome storage and creates list items for each URL.
     */
    function displayUrls() {
        chrome.storage.sync.get({ urls: [] }, function(data) {
            urlList.innerHTML = '';
            if (data.urls.length > 0) {
                deleteAllButton.style.display = 'block';
            } else {
                deleteAllButton.style.display = 'none';
            }
            data.urls.forEach(function(url, index) {
                const div = document.createElement('div');
                div.className = 'urlItem';

                const urlLink = document.createElement('a');
                urlLink.href = url;
                urlLink.textContent = url;
                urlLink.target = '_blank'; // Open link in a new tab

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', function() {
                    deleteUrl(index);
                });

                div.appendChild(urlLink);
                div.appendChild(deleteButton);
                urlList.appendChild(div);
            });
        });
    }

    /**
     * Deletes a URL from Chrome storage.
     * @param {number} index - The index of the URL to delete.
     */
    function deleteUrl(index) {
        chrome.storage.sync.get({ urls: [] }, function(data) {
            const urls = data.urls;
            urls.splice(index, 1);
            chrome.storage.sync.set({ urls: urls }, function() {
                displayUrls();
            });
        });
    }

    // Initial display of URLs when the popup is opened
    displayUrls();
});

darkModeButton.addEventListener('click', function() {
    if (darkModeIcon.classList.contains('fa-moon-o')) {
        darkModeIcon.classList.remove('fa-moon-o');
        darkModeIcon.classList.add('fa-sun-o');
    } else {
        darkModeIcon.classList.remove('fa-sun-o');
        darkModeIcon.classList.add('fa-moon-o');
    }
});