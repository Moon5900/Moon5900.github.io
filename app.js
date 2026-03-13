// Your Firebase config and initialization (already included in your HTML, so you can remove it from `app.js`)
const db = firebase.firestore();

let cart = [];

function addToCart(name, price) {
  cart.push({ name, price });
  renderCart();
}

function renderCart() {
  const cartDiv = document.getElementById('cart');
  cartDiv.innerHTML = '';
  cart.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - $${item.price}`;
    cartDiv.appendChild(li);
  });
}

function placeOrder() {
  if (cart.length === 0) {
    alert('Cart is empty!');
    return;
  }
  db.collection('orders').add({
    items: cart,
    timestamp: new Date()
  }).then(() => {
    alert('Order placed!');
    cart = [];
    renderCart();
    fetchOrders();
  });
}

function fetchOrders() {
  const ordersDiv = document.getElementById('orders');
  ordersDiv.innerHTML = '';

  db.collection('orders').orderBy('timestamp', 'desc').get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const order = doc.data();
        const orderDiv = document.createElement('div');
        orderDiv.innerHTML = `
          <p>Order at ${order.timestamp.toDate()}</p>
          <ul>
            ${order.items.map(item => `<li>${item.name} - $${item.price}</li>`).join('')}
          </ul>
        `;
        ordersDiv.appendChild(orderDiv);
      });
    });
}

// Load orders initially
fetchOrders();
setInterval(fetchOrders, 10000);