const API = "http://localhost:8000/travel";

let inpTour = document.getElementById("inpTour");
let inpInformation = document.getElementById("inpInformation");
let inpImage = document.getElementById("inpImage");
let sectionProduct = document.getElementById("sectionProduct");
let inpPrice = document.getElementById("inpPrice");

let btnOpenFor = document.getElementById("flush-collapseOne");
let searchValue = "";
let currentPage = 1;
let countPage = 1;

btnAdd.addEventListener("click", () => {
  if (
    !inpTour.value.trim() ||
    !inpInformation.value.trim() ||
    !inpImage.value.trim() ||
    !inpPrice.value.trim()
  ) {
    alert("Заполните поле!");
    return;
  }
  let newProduct = {
    productTour: inpTour.value,
    productInformation: inpInformation.value,
    productImage: inpImage.value,
    productPrice: inpPrice.value,
  };
  console.log(newProduct);

  createProduct(newProduct); // вызываем функуцию для добавления в базу данных и передаем в качестве аргумента обьект созданный выше
  readProducts(); // для отображения даннх
});
// ! ================= CREATE =====================
function createProduct(product) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(product),
  }).then(() => readStudents());
  inpTour.value = "";
  inpInformation.value = "";
  inpImage.value = "";
  inpPrice.value = "";

  btnOpenFor.classList.toggle("show");
}

// !=============== READ ====================
// Создаём функцию для отображения
function readProducts() {
  //   отправляем запрос в db.json с настройками поиска и пагинации. знак q - нужен для того чтобы найти элемент во всей базе данных.знак & ставится если добавляем новые настройки к предыдущим. _page - для тошо чтобы открыть конкретную страницу. _limit - для отображения несколльких элементов на сайте
  fetch(`${API}?q=${searchValue}&_page=${currentPage}&_limit=4`) // для получения данных из db.json
    .then((res) => res.json())
    .then((data) => {
      sectionProduct.innerHTML = ""; // очищаем тег section чтобы не было дубликатов
      data.forEach((item) => {
        sectionProduct.innerHTML += `
          <div class="card mt-3" style="width: 18rem;">
        <img src="${item.productImage}" class="card-img-top" style="height:250px" alt="${item.productTour}">
           <div class="card-body">
          <h5 class="card-title">${item.productTour}</h5>
          <p class="card-text">${item.productInformation}</p>
          <p class="card-text">${item.productImage}</p>
          <p class="card-text">${item.productPrice}</p>
          <button class="btn btn-outline-danger btnDelete" id="${item.id}">
          Delete
          </button>
          <button class="btn btn-outline-light btnEdit" id = "${item.id}" data-bs-toggle="modal"
          data-bs-target="#exampleModal">
          Change
          </button>
          </div>
          </div>
          `;
      });
      sumPage(); // вызов функции для нахождения кол-во страниц
    });
}
readProducts();
//! DELETE
document.addEventListener("click", (event) => {
  let del_class = [...event.target.classList]; //сохраняем массив с классами в переменную, используя spread оператор
  if (del_class.includes("btnDelete")) {
    // проверяет есть ли в нашем поиске класс btnDelete
    let del_id = event.target.id; //сохраняем в переменную id нашего элемента по которому кликнули
    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readProducts()); // для того чтобы вызов функции отображения данных подождал пока запрос delete выполнился а затем сработал
  }
});
//! EDIT
//сохраняем в переменные названия инпутов и кнопки
let editInpTour = document.getElementById("editInpTour");
let editInpInformation = document.getElementById("editInpInformation");
let editInpImage = document.getElementById("editInpImage");
let editInpPrice = document.getElementById("editInpPrice");
let editBtnSave = document.getElementById("editBtnSave");
let editSectionProduct = document.getElementById("editSectionProduct");

// событие на кнопку изменить
document.addEventListener("click", (event) => {
  // с помощью обьекта event ищем класс нашего элемента
  let editArr = [...event.target.classList];
  if (editArr.includes("btnEdit")) {
    // проверем есть ли в массиве с классами наш класс btnEdit
    let id = event.target.id; // сохраняем в переменную id,ша нашего элемента
    fetch(`${API}/${id}`) // с помощью запроса GET обращаемся к конкретному обьекту
      .then((res) => res.json())
      .then((data) => {
        // созраняем в инпуты модального окна данные из db,json
        editInpTour.value = data.productTour;
        editInpInformation.value = data.productInformation;
        editInpImage.value = data.productImage;
        editInpPrice.value = data.productPrice;

        // добавляем при помощи метода setAttribute id в нашу кнопку сохранить дл того чтобы передать в дальнейшем в аргументы функции editBook
        editBtnSave.setAttribute("id", data.id);
      });
  }
}); //событие на кнопку сохранить
editBtnSave.addEventListener("click", () => {
  // создаем обьект с измененными данными и в дальнейшем для отправки db.json
  let editedProduct = {
    productTour: editInpTour.value,

    productInpformation: editInpInformation.value,
    productImage: editInpImage.value,
  };
  editProduct(editedProduct, editBtnSave.id); // вызов функции для отправки измененных данных в db.json в качестве аргумента передаем вышесозданный обьект и значение атрибута id из кнопки сохранить
});
function editProduct(objEditProduct, id) {
  // функция для отправки измененных данных в db.json
  fetch(`${API}/${id}`, {
    // в параметры принимаем: измененный обьект и id jп котрому будем обращаться
    method: "PATCH", // используем метод PATCH для запроса на изменение данных на db.json
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(objEditProduct),
  }).then(() => readProducts()); // вызов функции для отображения данных сразу же после нажатия на кнопку сохранить
}
//! SEARCH
//сохраняем в переменную инпут поиска из inde.html
let inpSearch = document.getElementById("inpSearch");

inpSearch.addEventListener("input", (event) => {
  searchValue = event.target.value; // сохраняем в  переменную значение инпута
  readProducts(); // вызываем функцию для отображения данных и сразу же после изменения инпута Поиск
});
//! =================PAGINATION======================

let prevBtn = document.getElementById("prevBtn");
let nextBtn = document.getElementById("nextBtn");

prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) {
    return;
  }
  currentPage = currentPage - 1;
  readProducts();
});

nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) {
    return;
  }
  currentPage = currentPage + 1;
  readProducts();
});

function sumPage() {
  fetch(API)
    .then((res) => res.json())
    .then((data) => {
      countPage = Math.ceil(data.length / 4);
    });
}

const productContainers = [...document.querySelectorAll(".product-container")];
const nxtBtn = [...document.querySelectorAll(".nxt-btn")];
const preBtn = [...document.querySelectorAll(".pre-btn")];

productContainers.forEach((item, i) => {
  let containerDimensions = item.getBoundingClientRect();
  let containerWidth = containerDimensions.width;

  nxtBtn[i].addEventListener("click", () => {
    item.scrollLeft += containerWidth;
  });

  preBtn[i].addEventListener("click", () => {
    item.scrollLeft -= containerWidth;
  });
});
