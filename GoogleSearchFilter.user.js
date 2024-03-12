// ==UserScript==
// @name         Google Search Filter and Clean-up
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically exclude specific sites from Google search and clean search box
// @author       safteinzz
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const sitesToExclude = [
        '-site:3djuegos.com',
        // moar pages
    ];

    function needsModification(url) {
        return sitesToExclude.some(exclusion => !url.includes(exclusion));
    }

    function modifySearchQuery() {
        let url = new URL(window.location.href);
        let searchParams = url.searchParams;

        let qValue = searchParams.get('q');

        if (qValue && needsModification(qValue)) {
            qValue += ' ' + sitesToExclude.join(' ');
            searchParams.set('q', qValue);
            url.search = searchParams.toString();
            window.location.href = url.href;
        }
    }

    function cleanSearchBox() {
        const searchBox = document.querySelector('textarea[name="q"]');
        if (searchBox) {
            let newValue = searchBox.value;
            sitesToExclude.forEach(site => {
                newValue = newValue.replace(new RegExp(site, 'gi'), '').trim();
            });
            newValue = newValue.replace(/\s{2,}/g, ' ');

            searchBox.value = newValue;
            console.log(`Cleaned search box: "${newValue}"`);

            const event = new Event('input', { 'bubbles': true, 'cancelable': true });
            searchBox.dispatchEvent(event);
        }
    }

    if (window.location.href.includes('google.com/search?')) {
        modifySearchQuery();
        setTimeout(cleanSearchBox, 100);
    }
})();
