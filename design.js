
let cart = [];

function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('showing');
}

function addToCart(flavor, price) {
  const existingItem = cart.find(item => item.name === flavor);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name: flavor, price: price, quantity: 1 });
  }
  renderCart();
}
const dingSound = new Audio('sweet-cart-ding.wav');

function openCart() {
  dingSound.play();
  document.getElementById('cartModal').style.display = 'block';
  renderCart();
}


function removeFromCart(flavor) {
  const index = cart.findIndex(item => item.name === flavor);
  if (index !== -1) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1);
    }
  }
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.quantity * item.price;
    total += itemTotal;
    cartItems.innerHTML += `
      <div class="cart-item">
        <span><strong>${item.quantity}x ${item.name}</strong> - $${itemTotal.toFixed(2)}</span>
        <div class="cart-buttons">
          <button onclick="addToCart('${item.name}', ${item.price})">+</button>
          <button onclick="removeFromCart('${item.name}')">-</button>
        </div>
      </div>
    `;
  });

  cartTotal.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
}

function openCart() {
  document.getElementById('cartModal').style.display = 'block';
  renderCart();
}

function closeCart() {
  document.getElementById('cartModal').style.display = 'none';
}

function openOrderForm() {
  document.getElementById('cartModal').style.display = 'none';
  document.getElementById('orderModal').style.display = 'block';
}

function closeOrderForm() {
  document.getElementById('orderModal').style.display = 'none';
}

document.addEventListener("DOMContentLoaded", function () {
  const orderForm = document.getElementById("orderForm");
  if (orderForm) {
    orderForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const params = {
        name: document.getElementById("orderName").value,
        address: document.getElementById("orderAddress").value,
        email: document.getElementById("orderEmail").value,
        order: cart.map(item => `${item.quantity}x ${item.name}`).join(", "),
        total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
      };

      emailjs.send("service_6supnnl", "template_ala1u6q", params)
        .then(() => {
          alert("Order placed successfully!");
          cart = [];
          orderForm.reset();
          closeOrderForm();
        })
        .catch(err => {
          console.error("EmailJS Error:", err);
          alert("Something went wrong. Please try again.");
        });
    });
  }
});
