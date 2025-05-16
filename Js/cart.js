

document.addEventListener("DOMContentLoaded", () => {
  const cartItems = document.getElementById("cart-items");
  const totalPrice = document.getElementById("total-price");
  const cartCount = document.getElementById("cart-count"); // Make sure you have this in your header or somewhere

  
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  
  function updateCartCount() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCount) {
      cartCount.textContent = totalQty;
    }
  }

  
  window.addToCart = function (product) {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      existingProduct.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    saveCart();
    updateCartCount();
    alert(`${product.title} added to cart!`);
  };

  
  function renderCart() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price * item.qty;
      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <img src="${item.image}" alt="${item.title}" />
        <div class="cart-item-details">
          <h3>${item.title}</h3>
          <p>$${item.price.toFixed(2)} x ${item.qty}</p>
          <p>Subtotal: $${(item.price * item.qty).toFixed(2)}</p>
          <button onclick="removeFromCart(${index})">Remove</button>
        </div>
      `;
      cartItems.appendChild(div);
    });

    totalPrice.textContent = `Total: $${total.toFixed(2)}`;
  }

 
  window.removeFromCart = function (index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
    updateCartCount();
  };

  
  renderCart();
  updateCartCount();
});

