# AgroMarket

A frontend-only agricultural produce marketplace mini project built with HTML, CSS and JavaScript.

## Run the project
1. Extract the ZIP file.
2. Open the `AgroMarket` folder in VS Code.
3. Open `index.html` with Live Server.

## Add or change sample product cards
Open `assets/script.js` and edit the `sampleProducts` array. Each product has a name, category, price, quantity, location, image path and WhatsApp number.

Put image files in `assets/images/` and update the matching image path in `script.js`. For the homepage background, add an image named `farm.jpg` to `assets/images/`.

## Add products through the Sell Produce page
Open `sell.html`, fill the form and select a picture. JavaScript stores the product in this browser's LocalStorage and displays it on Browse Produce.

## Important limitation
This is a frontend demonstration. Products saved in LocalStorage are only available in the same browser and device. Other users will not see them. A shared marketplace requires a backend and database (for example PHP and MySQL).
