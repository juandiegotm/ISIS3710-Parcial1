const url = "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json";
let categories = {};
const carrito = [];


window.onload = ()=> {

    GET(url).then(info => {
        /**
         * Primero muestra las categorias
         */
        categories = info;
        categoryNames = info.map((value) => value.name);
        showCategories(categoryNames);

        /**
         * Deja por defecto la primera categoria seleccionada
         */
        showCategoryElements(categories[0].name);
    })

}

function showCategories (categoryNames) {
    const navbarNav = document.getElementsByClassName("navbar-nav")[0];
    
    for(let category of categoryNames){
        const navbarElement = document.createElement("a");
        navbarElement.className = "nav-item nav-link";
        navbarElement.innerHTML = category;
        navbarElement.addEventListener('click', () => {
            showCategoryElements(category);
        })

        navbarNav.appendChild(navbarElement);
    }
} 

function showCategoryElements (category){
    // Primero cambia el titulo
    const pageTitle = document.getElementsByClassName("pageTitle")[0];
    pageTitle.innerHTML = category;

    // Busca la categorias
    const hamburgers = document.getElementsByClassName("hamburgers")[0];
    hamburgers.textContent = "";

    const elements = categories.find((value) => value.name === category).products;

    for(let product of elements){
        const card = document.createElement("div");
        card.className = "card hamburger";
        
        const img = document.createElement("img");
        img.className = "card-img-top";
        img.src = product.image;
        img.alt = "Foto del producto " + product.name;
        card.appendChild(img);

        const body = document.createElement("div");
        body.className = "card-body";

        const cardTitle = document.createElement("h5");
        cardTitle.className = "card-title"
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
        body.appendChild(button); 

        card.appendChild(body);
        hamburgers.appendChild(card);
    }
}

function GET (url){
    return new Promise((resolve, reject) => {
       let req = new XMLHttpRequest();
       req.open('get', url)
       req.onload = function(){
           if(req.status == 200){
               resolve(JSON.parse(req.responseText));
           } else {
               reject(req.status);
           }
       }
       req.send();
    });
} 


