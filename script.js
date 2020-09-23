const url =
  "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json";
let categories = {};
let carrito = {};

const VISTA_CARRITO = "carrito-detail";
const VISTA_PRODUCTOS = "products";

window.onload = () => {
  GET(url).then((info) => {
    /**
     * Primero muestra las categorias
     */
    categories = info;
    categoryNames = info.map((value) => value.name);
    showCategories(categoryNames);
    mostrarVista(VISTA_PRODUCTOS);
    /**
     * Deja por defecto la primera categoria seleccionada
     */
    renderCategoryElements(categories[0].name);
  });
};

function mostrarVista(vista) {
  const productsElement = document.getElementsByClassName(VISTA_PRODUCTOS)[0];
  const carritoElement = document.getElementsByClassName(VISTA_CARRITO)[0];

  if (vista === VISTA_CARRITO) {
    productsElement.style.display = "none";
    carritoElement.style.display = "flex";
  } else if (vista === VISTA_PRODUCTOS) {
    productsElement.style.display = "flex";
    carritoElement.style.display = "none";
  }
}

function showCategories(categoryNames) {
  const navbarNav = document.getElementsByClassName("navbar-nav")[0];

  for (let category of categoryNames) {
    const navbarElement = document.createElement("a");
    navbarElement.className = "nav-item nav-link";
    navbarElement.innerHTML = category;
    navbarElement.addEventListener("click", () => {
      renderCategoryElements(category);
    });

    navbarNav.appendChild(navbarElement);
  }
}

function updateNumItems() {
  const element = document.getElementsByClassName("numItems")[0];
  element.innerHTML =
    Object.keys(carrito).length === 0
      ? ""
      : `${Object.keys(carrito).length} items`;
}

function renderCarrito() {
  const pageTitle = document.getElementsByClassName("pageTitle")[0];
  pageTitle.innerHTML = "Order detail";

  mostrarVista(VISTA_CARRITO);

  const oldTable = document.getElementsByTagName("tbody")[0];
  const table = document.createElement("tbody");

  let total = 0;

  let itemNum = 1;
  for (let nameProduct in carrito) {
    const productInCarrito = carrito[nameProduct];

    const row = table.insertRow(-1);

    const item = row.insertCell(-1);
    item.innerHTML = itemNum++;

    const qty = row.insertCell(-1);
    qty.innerHTML = productInCarrito.qty;

    const name = row.insertCell(-1);
    name.innerHTML = productInCarrito.name;

    const unitPrice = row.insertCell(-1);
    unitPrice.innerHTML = productInCarrito.price;

    const amount = row.insertCell(-1);
    const valueAmount = productInCarrito.price * productInCarrito.qty;
    total += valueAmount;

    amount.innerHTML = valueAmount;
  }

  oldTable.parentNode.replaceChild(table, oldTable);

  const totalElement = document.getElementsByClassName("total")[0];
  totalElement.innerHTML = "Total: $" + total;
}

function confirmOrder() {
  if (Object.keys(carrito).length > 0) {
    const carritoArray = [];
    for (let productName in carrito) carritoArray.push(carrito[productName]);
    console.log(carritoArray);
    carrito = {};
    updateNumItems();
    renderCarrito();
  }
}

function cancelOrder() {
  carrito = {};
  updateNumItems();
  renderCarrito();
}

function renderCategoryElements(category) {
  mostrarVista(VISTA_PRODUCTOS);

  // Primero cambia el titulo
  const pageTitle = document.getElementsByClassName("pageTitle")[0];
  pageTitle.innerHTML = category;

  // Busca la categorias
  const productsElement = document.getElementsByClassName("products")[0];
  productsElement.textContent = "";

  const elements = categories.find((value) => value.name === category).products;

  for (let product of elements) {
    const card = document.createElement("div");
    card.className = "card product";

    const img = document.createElement("img");
    img.className = "card-img-top";
    img.src = product.image;
    img.alt = "Foto del producto " + product.name;
    card.appendChild(img);

    const body = document.createElement("div");
    body.className = "card-body";

    const cardTitle = document.createElement("h5");
    cardTitle.className = "card-title";
    cardTitle.innerHTML = product.name;
    body.appendChild(cardTitle);

    const cardText = document.createElement("p");
    cardText.className = "card-text";
    cardText.innerHTML = product.description;
    body.appendChild(cardText);

    const price = document.createElement("h5");
    price.innerHTML = "$" + product.price;
    body.appendChild(price);
    const button = document.createElement("a");
    button.className = "btn btn-primary";
    button.innerHTML = "Add to car";
    button.addEventListener("click", () => {
      if (carrito[product.name]) carrito[product.name].qty += 1;
      else
        carrito[product.name] = {
          ...product,
          qty: 1,
        };
      updateNumItems();
    });
    body.appendChild(button);

    card.appendChild(body);
    productsElement.appendChild(card);
  }
}

function GET(url) {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();
    req.open("get", url);
    req.onload = function () {
      if (req.status == 200) {
        resolve(JSON.parse(req.responseText));
      } else {
        reject(req.status);
      }
    };
    req.send();
  });
}
