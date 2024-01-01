// Import delle risorse esterne
import _ from "lodash";
import "../scss/main.scss";
import axios from "axios";
import { preventImageDrag } from "./main.js";

// Seleziono gli elementi del DOM una sola volta
const displayCategory = document.querySelector(".category");
const containerCards = document.querySelector(".container-cards");
const link = document.querySelectorAll(".link");
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

// Funzione per creare una modale
const createModal = function (title, description, authors) {
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
    modal.style.display = "none";
    overlay.remove();
  };

  document.body.appendChild(modal);
  modal.style.display = "block";
};

// Funzione per renderizzare le carte dei libri
function renderBooks() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Utilizzo della funzione "slice" di lodash per ottenere una porzione dell'array
  const booksToDisplay = _.slice(arrayBooks, startIndex, endIndex);

  scrollToTop();
  containerCards.innerHTML = "";

  booksToDisplay.forEach((element) => {
    const { cover_id, title, authors, key } = element;
    const bookCard = createCard(cover_id, title, authors[0].name, key);
    containerCards.appendChild(bookCard);
  });
}

// Funzione per aggiornare la paginazione
function updatePagination() {
  const totalPages = Math.ceil(arrayBooks.length / itemsPerPage);

  // Utilizzo della funzione "times" di lodash per semplificare il loop
  _.times(link.length, (index) => {
    link[index].value = index + 1;
    link[index].classList.toggle("active", currentPage === link[index].value);
  });

  btnBack.disabled = currentPage === 1;
  btnNext.disabled = currentPage === totalPages;
}

// Funzione per caricare i libri
function loadBooks() {
  if (jsonData && inputSubject) {
    displayCategory.innerHTML = `${inputSubject} books`;
    arrayBooks = jsonData.works;

    // Utilizzo della funzione "debounce" di lodash per ritardare l'esecuzione della funzione
    const debouncedRenderBooks = _.debounce(renderBooks, 300);
    debouncedRenderBooks();

    updatePagination();
    scrollToTop();
  }
}

// Funzione per gestire il click sui link
function handleLinkClick(event) {
  currentPage = parseInt(event.target.value);
  renderBooks();
  updatePagination();
}

// Funzione per gestire il click sul pulsante "Indietro"
function handleBackBtnClick() {
  if (currentPage > 1) {
    currentPage--;
    renderBooks();
    updatePagination();
  }
}

// Funzione per gestire il click sul pulsante "Avanti"
function handleNextBtnClick() {
  const totalPages = Math.ceil(arrayBooks.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderBooks();
    updatePagination();
  }
}

// Aggiungo gli eventi agli elementi del DOM una volta che la pagina è caricata
window.addEventListener("load", function () {
  // Utilizzo della funzione "forEach" di lodash per semplificare l'iterazione
  _.forEach(link, (l) => l.addEventListener("click", handleLinkClick));

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
      window.history.back();
    });
  }

  preventImageDrag();
  loadBooks();
});
