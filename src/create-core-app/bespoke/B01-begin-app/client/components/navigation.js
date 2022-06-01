const topNavLinks = [
    { "text": "Home", "url": "/index.html"},
    { "text": "My Orders", "url": "/pages/myOrders.html" },
    { "text": "Products", "url": "/pages/categories.html" },
];

export class topNavPanel extends HTMLElement {

    async connectedCallback() {

        let listItemHtml = "";
        topNavLinks.forEach(link => {
            if (window.location.href.indexOf(link.url) < 0) {
                listItemHtml += '<li><a href="' + link.url + '">' + link.text + '</a></li>';
            } else {
                return listItemHtml += '<li><a href="' + link.url + '" class="selected">' + link.text + '</a></li>';
            }
        });
        this.innerHTML = `
            <ul class="topnav">${listItemHtml}</ul>
        `;

    }
}

// Define the web component
customElements.define('top-nav-panel', topNavPanel);
