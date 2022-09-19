// getElementById Section
const templateFooter = document.getElementById("template-footer").content;
const templateCard = document.getElementById("template-card").content;
const templateCart = document.getElementById("template-cart").content;
const fragment = document.createDocumentFragment();
const footer = document.getElementById("footer");
const cards = document.getElementById("cards");
const items = document.getElementById("items");

// Our Cart
let cart = {};

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
  // Local Store Part 1
  if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
    showCart();
  }
});

cards.addEventListener("click", (e) => {
  addToCart(e);
});

items.addEventListener("click", (e) => {
  btnAction(e);
});

// Fetch
const fetchData = async () => {
  try {
    const res = await fetch("api.json");
    const data = await res.json();
    showCards(data);
  } catch (error) {
    console.log(error);
  }
};

// ShowCards Section
const showCards = (data) => {
  data.forEach((producto) => {
    templateCard.getElementById("card-title").textContent = producto.title;
    templateCard.getElementById("card-price").textContent = producto.price;
    templateCard.getElementById("card-description").textContent =
      producto.description;
    templateCard
      .getElementById("products-image")
      .setAttribute("src", producto.src);
    templateCard.getElementById("addToCartButton").dataset.id = producto.id;
    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  cards.appendChild(fragment);
};

// Adding Products to our cart
const addToCart = (e) => {
  if (e.target.classList.contains("btn-dark")) {
    setCart(e.target.parentElement);
  }
  e.stopPropagation();
};

const setCart = (objeto) => {
  const producto = {
    id: objeto.querySelector(".btn-dark").dataset.id,
    title: objeto.querySelector("h5").textContent,
    price: objeto.querySelector("p").textContent,
    quantity: 1,
  };

  if (cart.hasOwnProperty(producto.id)) {
    producto.quantity = cart[producto.id].quantity + 1;
  }

  cart[producto.id] = { ...producto };
  showCart();
};

// Show Our Cart
const showCart = () => {
  items.innerHTML = "";
  Object.values(cart).forEach((producto) => {
    templateCart.querySelector("th").textContent = producto.id;
    templateCart.querySelectorAll("td")[0].textContent = producto.title;
    templateCart.querySelectorAll("td")[1].textContent = producto.quantity;
    templateCart.querySelector(".btn-info").dataset.id = producto.id;
    templateCart.querySelector(".btn-danger").dataset.id = producto.id;
    templateCart.querySelector("span").textContent =
      producto.quantity * producto.price;
    const clone = templateCart.cloneNode(true);
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);

  showFooter();

  // Local Stora Part 2
  localStorage.setItem("cart", JSON.stringify(cart));
};

const showFooter = () => {
  footer.innerHTML = "";
  if (Object.keys(cart).length === 0) {
    footer.innerHTML = `
    <th scope="row" colspan="5">Cart Empty!</th>
    `;
    return;
  }

  // Add quantity and add totals
  const nQuantity = Object.values(cart).reduce(
    (acc, { quantity }) => acc + quantity,
    0
  );
  const nPrice = Object.values(cart).reduce(
    (acc, { quantity, price }) => acc + quantity * price,
    0
  );

  templateFooter.querySelectorAll("td")[0].textContent = nQuantity;
  templateFooter.querySelector("span").textContent = nPrice;

  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);

  const btnEmptyCart = document.getElementById("empty-cart");
  btnEmptyCart.addEventListener("click", () => {
    cart = {};
    showCart();
  });
};

const btnAction = (e) => {
  // Button Increase Action
  if (e.target.classList.contains("btn-info")) {
    cart[e.target.dataset.id];
    const producto = cart[e.target.dataset.id];
    producto.quantity++;
    cart[e.target.dataset.id] = { ...producto };
    showCart();
  }
  // Button Action of diminishing
  if (e.target.classList.contains("btn-danger")) {
    const producto = cart[e.target.dataset.id];
    producto.quantity--;
    if (producto.quantity === 0) {
      delete cart[e.target.dataset.id];
    } else {
      cart[e.target.dataset.id] = { ...producto };
    }
    showCart();
  }
  e.stopPropagation();
};
