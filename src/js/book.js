// Import delle risorse esterne
import _ from "lodash";
import "../scss/main.scss";
import axios from "axios";
import { preventImageDrag } from "./main.js";

const displayCategory = document.querySelector(".category");
const containerCards = document.querySelector(".container-cards");
const btnBack = document.querySelector(".btn1");
const btnNext = document.querySelector(".btn2");

// Recupero i dati dal localStorage
const jsonData = JSON.parse(localStorage.getItem("jsonData"));
const inputSubject = localStorage.getItem("inputSubject");

let currentPage = 1;
const itemsPerPage = 12;
let arrayBooks = [];

// Funzione per rendere il corpo della pagina visibile scorrendo in modo smooth
function scrollToTop() {
  document.body.scrollIntoView({ behavior: "smooth" });
}

// Funzione per creare una card
const createCard = function (image, title, authors, key) {
  const card = document.createElement("div");
  card.className = "card-book";

  // Funzione per creare un elemento immagine
  const createImageElement = () => {
    const imgContainer = document.createElement("div");
    imgContainer.className = "container-img-book";

    if (image) {
      const img = document.createElement("img");
      img.src = `https://covers.openlibrary.org/b/id/${image}-L.jpg`;
      img.alt = `Image of the book: ${title}`;
      imgContainer.appendChild(img);
    }

    card.appendChild(imgContainer);
  };

  // Funzione per creare un elemento testo
  const createTextElement = () => {
    const textContainer = document.createElement("div");
    textContainer.className = "container-text-book";

    const h1Title = document.createElement("h1");
    h1Title.innerText = title;
    textContainer.appendChild(h1Title);

    const h2Author = document.createElement("h2");
    h2Author.innerText = authors;
    textContainer.appendChild(h2Author);

    card.appendChild(textContainer);
  };

  // Funzione per creare un bottone di descrizione
  const createDescriptionButton = () => {
    const btnDescription = document.createElement("button");
    btnDescription.type = "button";
    btnDescription.className = "btn-description";
    btnDescription.innerText = "description";

    btnDescription.onclick = () => {
      const bookKey = `https://openlibrary.org${key}.json`;

      axios
        .get(bookKey)
        .then((response) => {
          const data = response.data;
          const description =
            data.description || "Description is not available";
          const bookModal = createModal(data.title, description, authors);
        })
        .catch((error) => {
          console.error(`Description not found: ${error}`);
        });
    };

    card.appendChild(btnDescription);
  };

  createImageElement();
  createTextElement();
  createDescriptionButton();

  return card;
};
// Funzione createModale
const createModal = function (title, description, authors) {
  document.body.classList.add("modal-open");

  const modal = document.createElement("div");
  modal.className = "modal";

  const overlay = document.createElement("div");
  overlay.className = "overlay";
  document.body.appendChild(overlay);

  const contentContainer = document.createElement("div");
  contentContainer.className = "content-container";

  const h1TitleModal = document.createElement("h1");
  h1TitleModal.innerText = title;
  modal.appendChild(h1TitleModal);

  const h2AuthorModal = document.createElement("h2");
  h2AuthorModal.innerText = authors;
  modal.appendChild(h2AuthorModal);

  const descriptionModal = document.createElement("p");
  descriptionModal.innerText =
    typeof description === "object"
      ? description.value || "Description is not available"
      : description || "Description is not available";
  descriptionModal.className = "description";
  contentContainer.appendChild(descriptionModal);

  const btnClose = document.createElement("button");
  btnClose.type = "button";
  btnClose.className = "btn-close";
  btnClose.innerText = "Close";
  contentContainer.appendChild(btnClose);
  modal.appendChild(contentContainer);

  btnClose.onclick = () => {
    document.body.classList.remove("modal-open");

    modal.style.display = "none";
    overlay.remove();

    document.body.style.overflow = "auto";
  };

  document.body.appendChild(modal);

  setTimeout(() => {
    modal.classList.add("show");

    // Impedisci lo scroll del body quando la modale è aperta
    document.body.style.overflow = "hidden";
  }, 50);

  modal.style.display = "block";
};

// Funzione per renderizzare le carte dei libri
function renderBooks() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const booksToDisplay = _.slice(arrayBooks, startIndex, endIndex);

  scrollToTop();
  containerCards.innerHTML = "";

  booksToDisplay.forEach((element) => {
    const { cover_id, title, authors, key } = element;
    const bookCard = createCard(cover_id, title, authors[0].name, key);
    containerCards.appendChild(bookCard);
  });
}

// Funzione per creare la lista e i suoi elementi
function createPaginationList(start, end) {
  let paginationList = document.querySelector(".pagination-list");

  for (let i = start; i <= end; i++) {
    let listItem = document.createElement("li");
    listItem.className = "link";
    listItem.setAttribute("value", i);
    listItem.textContent = i;

    paginationList.appendChild(listItem);
  }
}

// Funzione per aggiornare la paginazione
function updatePagination() {
  const totalPages = Math.ceil(arrayBooks.length / itemsPerPage);

  const pagesToShow = 5;

  // Calcolo dell'indice iniziale e finale delle pagine da mostrare
  let startIndex = Math.max(currentPage - Math.floor(pagesToShow / 2), 1);
  let endIndex = Math.min(startIndex + pagesToShow - 1, totalPages);

  if (endIndex - startIndex + 1 < pagesToShow) {
    startIndex = Math.max(endIndex - pagesToShow + 1, 1);
  }

  let paginationList = document.querySelector(".pagination-list");
  paginationList.innerHTML = "";

  // Creazione delle nuove pagine
  for (let i = startIndex; i <= endIndex; i++) {
    let listItem = document.createElement("li");
    listItem.className = "link";
    listItem.setAttribute("value", i);
    listItem.textContent = i;

    paginationList.appendChild(listItem);

    if (i === currentPage) {
      listItem.classList.add("active");
    }
  }

  btnBack.disabled = currentPage === 1;
  btnNext.disabled = currentPage === totalPages;
}

// Funzione per caricare i libri
function loadBooks() {
  if (jsonData && inputSubject) {
    displayCategory.innerHTML = `${inputSubject} books`;
    arrayBooks = jsonData.works;
    // Aggiungi la classe 'active' al primo link quando carichi i libri
    const firstPageLink = document.querySelector(".link");
    if (firstPageLink) {
      firstPageLink.classList.add("active");
    }
    renderBooks();

    updatePagination();
    scrollToTop();
  }
}
// Funzione per gestire la pagina che è attualmente cliccata
function handlePageLinkClick(event) {
  console.log("click page");

  if (!event.target.classList.contains("active")) {
    document
      .querySelectorAll(".link")
      .forEach((link) => link.classList.remove("active"));

    event.target.classList.add("active");

    currentPage = parseInt(event.target.value);

    const firstPageLink = document.querySelector(".link");
    if (firstPageLink) {
      firstPageLink.classList.add("active");
    }

    renderBooks();
    updatePagination();
  }
}

// Funzione per renderizzare le cardbook
function _renderCard() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const booksToDisplay = _.slice(arrayBooks, startIndex, endIndex);

  scrollToTop();
  containerCards.innerHTML = "";

  booksToDisplay.forEach((element) => {
    const { cover_id, title, authors, key } = element;
    const bookCard = createCard(cover_id, title, authors[0].name, key);
    containerCards.appendChild(bookCard);
  });
}

// Funzione per gestire il click sul pulsante "Indietro"
function handleBackBtnClick() {
  console.log("click bottone 1");
  if (currentPage > 1) {
    currentPage--;
    _renderCard();
    updatePagination();
  }
}

// Funzione per gestire il click sul pulsante "Avanti"
function handleNextBtnClick() {
  const totalPages = Math.ceil(arrayBooks.length / itemsPerPage);
  console.log("click bottone 2");
  if (currentPage < totalPages) {
    currentPage++;
    _renderCard();
    updatePagination();
  }
}

// Aggiungo gli eventi agli elementi del DOM una volta che la pagina è caricata
window.addEventListener("load", function () {
  if (btnBack) {
    btnBack.addEventListener("click", handleBackBtnClick);
  }

  if (btnNext) {
    btnNext.addEventListener("click", handleNextBtnClick);
  }

  const btnHome = document.querySelector(".btn-home");
  if (btnHome) {
    btnHome.addEventListener("click", function () {
      localStorage.removeItem("jsonData");
      localStorage.removeItem("inputSubject");
      console.log("Dati rimossi dal Local Storage");
      window.location.href = "/index.html";
    });
  }

  preventImageDrag();
  loadBooks();

  document
    .querySelector(".pagination-list")
    .addEventListener("click", function (event) {
      if (event.target.classList.contains("link")) {
        handlePageLinkClick(event);
      }
    });
});
