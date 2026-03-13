// Your Firebase config (replace with your actual config from Firebase project)
const firebaseConfig = {
  apiKey: "AIzaSyAU4t_i3js8O2pzqjv2iQd71hfQIA8mTI4",
  authDomain: "lucky-scoops.firebaseapp.com",
  projectId: "lucky-scoops",
  storageBucket: "lucky-scoops.firebasestorage.app",
  messagingSenderId: "749314696909",
  appId: "1:749314696909:web:a3532aefb9b264ee8d6b84"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let cart = [];

// Add product to cart
function addToCart(name, price) {
  cart.push({ name, price });
  renderCart();
}

// Render cart items
function renderCart() {
  const cartDiv = document.getElementById('cart');
  cartDiv.innerHTML = '';
  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - $${item.price}`;
    cartDiv.appendChild(li);
  });
}

// Place order
function placeOrder() {
  if (cart.length === 0) {
    alert('Cart is empty!');
    return;
  }
  // Save order to Firebase
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

// Fetch all orders
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

// Optional: refresh orders every 10 seconds
setInterval(fetchOrders, 10000);