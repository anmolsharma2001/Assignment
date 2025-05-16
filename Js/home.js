document.addEventListener("DOMContentLoaded", async () => {
  const productList = document.getElementById("product-list");
  const searchInput = document.getElementById("search");
  const categoryFilter = document.getElementById("category-filter");
  const cartCount = document.getElementById("cart-count");

  let allProducts = [];

  async function fetchProducts() {
    const res = await fetch("https://fakestoreapi.com/products");
    const data = await res.json();
    allProducts = data;
    renderProducts(data);
    populateCategories(data);
    updateCartCount();
  }

  function populateCategories(products) {
    const categories = [...new Set(products.map((p) => p.category))];
    categoryFilter.innerHTML = `<option value="">All Categories</option>`;
    categories.forEach((cat) => {
      categoryFilter.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
  }

  function renderProducts(products) {
    productList.innerHTML = "";
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    products.forEach((product) => {
      const isInCart = cart.some((item) => item.id === product.id);

      const div = document.createElement("div");
      div.className = "product";
      div.dataset.id = product.id;

      div.innerHTML = `
        <img src="${product.image}" alt="${product.title}" />
        <div>
          <h3>${product.title}</h3>
          <p><strong>Price:</strong> $${product.price}</p>
          <p><strong>Category:</strong> ${product.category}</p>
          <div style="display: flex; align-items: center; gap: 10px;">
            <button class="add-to-cart-btn">Add to Cart</button>
            <span class="cart-status" style="color: green;">${
              isInCart ? "Added to Cart" : ""
            }</span>
          </div>
        </div>
      `;
      productList.appendChild(div);
    });
  }

  productList.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart-btn")) {
      const productDiv = e.target.closest(".product");
      const productId = parseInt(productDiv.dataset.id);
      const product = allProducts.find((p) => p.id === productId);
      if (product) {
        addToCart(product);
        const statusSpan = productDiv.querySelector(".cart-status");
        statusSpan.textContent = "Added to Cart";
      }
    }
  });

  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item.id === product.id);
    if (existing) existing.qty += 1;
    else cart.push({ ...product, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartCount.textContent = cart.reduce((acc, item) => acc + item.qty, 0);
  }

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = allProducts.filter((p) =>
      p.title.toLowerCase().includes(query)
    );
    renderProducts(filtered);
  });

  categoryFilter.addEventListener("change", () => {
    const category = categoryFilter.value;
    const filtered = category
      ? allProducts.filter((p) => p.category === category)
      : allProducts;
    renderProducts(filtered);
  });

  fetchProducts();
});
