document.addEventListener('DOMContentLoaded', () => {
    let postButton = document.getElementById('post-button');
    postButton.addEventListener('click', () => {
        chrome.tabs.getSelected(null, (tab) => {
            // let fm = document.createElement('form');
            // fm.action = 'http://gtmetrix.com/analyze.html?bm';
            // fm.method = 'post';
            // let i = document.createElement('input');
            // i.type = 'hidden';
            // i.name = 'url';
            // i.value = tab.url;
            // fm.appendChild(i);
            // document.body.appendChild(fm);
            // fm.submit();
        });
    }, false);
}, false);