// Import delle risorse esterne
import _ from "lodash";
import "../scss/main.scss";
import axios from "axios";

document.addEventListener("DOMContentLoaded", function () {
  const buttonSearch = document.querySelector(".btn-search");
  const inputCategory = document.querySelector("#site-search");

  // Array di categorie valide
  const validCategories = [
    "fiction",
    "non-fiction",
    "mystery",
    "science fiction",
    "fantasy",
    "romance",
    "thriller",
    "horror",
    "biography",
    "autobiography",
    "history",
    "science",
    "self-help",
    "cooking",
    "travel",
    "art",
    "poetry",
    "children's",
    "young adult",
    "love",
  ];

  // Funzione che verifica se una categoria è valida
  const isValidCategory = (input) =>
    _.includes(validCategories, input.toLowerCase());

  const getCategory = async () => {
    const inputSubject = inputCategory.value;

    if (!isValidCategory(inputSubject)) {
      alert("Invalid input. Please enter a valid category.");
      return;
    }

    document.body.classList.add("loading");

    try {
      // Effettua una richiesta alla Open Library per ottenere i dati della categoria
      const response = await axios.get(
        `https://openlibrary.org/subjects/${inputSubject.toLowerCase()}.json?limit=240`
      );
      const jsonData = response.data;

      document.body.classList.remove("loading");

      // Salva l'oggetto JSON nel Local Storage
      localStorage.setItem("jsonData", JSON.stringify(jsonData));
      localStorage.setItem("inputSubject", inputSubject.toLowerCase());

      // Reindirizza alla pagina book.html
      const currentURL = new URL(window.location.href);
      currentURL.pathname = "/pages/book.html";
      window.location.href = currentURL.href;
      inputCategory.value = "";
      return jsonData;
    } catch (error) {
      console.log(error);
      document.body.classList.remove("loading");
    }
  };

  // Gestore dell'evento di clic sulla ricerca
  const btnSearchHandler = (event) => {
    // Verifica se l'evento è un tasto "Enter" o un clic
    if (event.key === "Enter" || event.type === "click") {
      event.preventDefault();
      getCategory();
    }
  };

  if (buttonSearch) {
    buttonSearch.addEventListener("click", btnSearchHandler);
  }

  if (inputCategory) {
    inputCategory.addEventListener("keydown", btnSearchHandler);
  }

  preventImageDrag();
});

// Funzione per prevenire il trascinamento delle immagini
export function preventImageDrag() {
  const images = document.querySelectorAll("img");

  images.forEach((image) => {
    image.addEventListener("dragstart", (event) => {
      event.preventDefault();
    });
  });
}
