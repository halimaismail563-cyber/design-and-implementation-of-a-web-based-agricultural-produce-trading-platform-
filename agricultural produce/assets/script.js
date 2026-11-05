// AgroMarket product data. Edit this list to change the sample products.
const sampleProducts = [
  {id:"sample-1",name:"Fresh Tomatoes",category:"Vegetables",price:15000,quantity:"50 baskets",location:"Lokoja, Kogi",image:"assets/images/tomato.jpeg",phone:"2348012345678",description:"Fresh farm tomatoes."},
  {id:"sample-2",name:"Yellow Maize",category:"Grains",price:45000,quantity:"20 bags",location:"Anyigba, Kogi",image:"assets/images/maize.jpeg",phone:"2348012345678",description:"Quality yellow maize."},
  {id:"sample-3",name:"Fresh Yam",category:"Tubers",price:30000,quantity:"100 tubers",location:"Idah, Kogi",image:"assets/images/atarado.jpeg",phone:"2348012345678",description:"Locally harvested yam."},
  {id:"sample-4",name:"Watermelon",category:"Fruits",price:12000,quantity:"30 pieces",location:"Lokoja, Kogi",image:"assets/images/melon.jpeg",phone:"2348012345678",description:"Fresh and sweet watermelon."},
  {id:"sample-5",name:"Local Rice",category:"Grains",price:80000,quantity:"10 bags",location:"Kabba, Kogi",image:"assets/images/vegetablee.jpeg",phone:"2348012345678",description:"Locally produced rice."},
  {id:"sample-6",name:"Fresh Pepper",category:"Vegetables",price:10000,quantity:"25 baskets",location:"Kogi",image:"assets/images/yello pepper.jpeg",phone:"2348012345678",description:"Fresh pepper from the farm."}

  
];

const STORAGE_KEY = "agromarket_products";
function getUserProducts() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function getAllProducts() { return [...getUserProducts(), ...sampleProducts]; }
function formatPrice(value) { return "₦" + Number(value).toLocaleString("en-NG"); }

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.name;
  img.onerror = () => { img.src = "assets/images/farm-placeholder.svg"; };
  const info = document.createElement("div");
  info.className = "product-info";
  const title = document.createElement("h3"); title.textContent = product.name;
  const category = document.createElement("p"); category.className = "product-category"; category.textContent = product.category;
  const price = document.createElement("p"); price.className = "product-price"; price.textContent = formatPrice(product.price);
  const quantity = document.createElement("p"); quantity.className = "product-location"; quantity.textContent = "Quantity: " + product.quantity;
  const location = document.createElement("p"); location.className = "product-location"; location.textContent = "Location: " + product.location;
  const contact = document.createElement("a"); contact.className = "contact-btn";
  contact.href = "https://wa.me/" + String(product.phone).replace(/\D/g, "");
  contact.target = "_blank"; contact.rel = "noopener"; contact.textContent = "Contact Seller";
  info.append(title, category, price, quantity, location, contact);
  card.append(img, info);
  return card;
}
function displayProducts(container, items) {
  if (!container) return;
  container.replaceChildren();
  if (!items.length) {
    const empty = document.createElement("p"); empty.className = "empty-message";
    empty.textContent = "No products found. Try another search or category.";
    container.append(empty); return;
  }
  items.forEach(item => container.append(createProductCard(item)));
}

// Homepage featured cards
const homeContainer = document.getElementById("homeProducts");
if (homeContainer) displayProducts(homeContainer, getAllProducts().slice(0, 3));

// Browse page: search, category filter and optional URL category
const productContainer = document.getElementById("productContainer");
if (productContainer) {
  let selectedCategory = new URLSearchParams(location.search).get("category") || "All";
  const searchInput = document.getElementById("searchInput");
  const buttons = document.querySelectorAll("[data-category]");
  function filterProducts() {
    const term = searchInput.value.trim().toLowerCase();
    const filtered = getAllProducts().filter(p => {
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchesSearch = [p.name,p.category,p.location,p.description].join(" ").toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
    displayProducts(productContainer, filtered);
  }
  buttons.forEach(button => {
    if (button.dataset.category === selectedCategory) {
      buttons.forEach(b => b.classList.remove("active")); button.classList.add("active");
    }
    button.addEventListener("click", () => {
      selectedCategory = button.dataset.category;
      buttons.forEach(b => b.classList.toggle("active", b === button));
      filterProducts();
    });
  });
  searchInput.addEventListener("input", filterProducts);
  document.getElementById("searchBtn").addEventListener("click", filterProducts);
  filterProducts();
}

// Sell form: image preview and browser-local product saving
const sellForm = document.getElementById("sellForm");
if (sellForm) {
  const imageInput = document.getElementById("productImage");
  const preview = document.getElementById("imagePreview");
  let selectedImage = "";
  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) { selectedImage = ""; preview.hidden = true; return; }
    if (!file.type.startsWith("image/")) {
      imageInput.value = ""; selectedImage = ""; preview.hidden = true;
      alert("Please select an image file."); return;
    }
    const reader = new FileReader();
    reader.onload = () => { selectedImage = reader.result; preview.src = selectedImage; preview.hidden = false; };
    reader.readAsDataURL(file);
  });
  sellForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(sellForm);
    if (!selectedImage) { document.getElementById("formMessage").textContent = "Please choose a product picture."; return; }
    const product = {
      id: "user-" + Date.now(),
      name: String(data.get("name")).trim(),
      category: String(data.get("category")),
      price: Number(data.get("price")),
      quantity: String(data.get("quantity")).trim(),
      location: String(data.get("location")).trim(),
      phone: String(data.get("phone")).trim(),
      description: String(data.get("description") || "").trim(),
      image: selectedImage
    };
    try {
      const saved = getUserProducts();
      saved.unshift(product);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      sellForm.reset(); preview.hidden = true; selectedImage = "";
      document.getElementById("formMessage").textContent = "Product published! View it on the Browse Produce page.";
    } catch (error) {
      document.getElementById("formMessage").textContent = "Could not save this image. Try a smaller image file.";
    }
  });
}
