import "../scss/main.scss";
import _ from "lodash";
import axios from "axios";

const displayCategory = document.querySelector(".category");
const containerCards = document.querySelector(".container-cards");
const sectionCards = document.querySelector(".cards");

window.addEventListener("load", function () {
  const jsonData = JSON.parse(localStorage.getItem("jsonData"));
  const inputSubject = localStorage.getItem("inputSubject");

  if (jsonData && inputSubject) {
    console.log(jsonData);
    displayCategory.innerHTML = `${inputSubject} books`;

    // Process jsonData here
    const arrayBooks = jsonData.works;
    arrayBooks.forEach((element) => {
      const bookCard = createCard(
        element.cover_id,
        element.title,
        element.authors[0].name,
        element.key
      );
      containerCards.appendChild(bookCard);
      sectionCards.appendChild(containerCards);
    });
  }

  // Event listener per rimuovere i dati quando si fa clic su "Home"
  const btnHome = document.querySelector(".btn-home");
  if (btnHome) {
    btnHome.addEventListener("click", function () {
      localStorage.removeItem("jsonData");
      localStorage.removeItem("inputSubject");
      console.log("Dati rimossi dal Local Storage");
      window.history.back();
    });
  }
});
const createCard = function (image, title, authors, key) {
  let card = document.createElement("div");
  card.className = "card-book";
  //create and append image container
  const imgContainer = document.createElement("div");
  imgContainer.className = "container-img-book";
  if (image) {
    const img = document.createElement("img");
    img.src = `https://covers.openlibrary.org/b/id/${image}-L.jpg`;
    img.alt = `Image of the book: ${title}`;
    imgContainer.appendChild(img);
  }
  card.appendChild(imgContainer);

  // create and append text container
  const textContainer = document.createElement("div");
  textContainer.className = "container-text-book";

  const h1Title = document.createElement("h1");
  h1Title.innerText = title;
  textContainer.appendChild(h1Title);
  const h2Author = document.createElement("h2");
  h2Author.innerText = authors;
  textContainer.appendChild(h2Author);

  card.appendChild(textContainer);

  //create and append description button
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
        console.log(response.data);
        const description = data.description || "Description is not available";
        const bookModal = createModal(data.title, description);
      })
      .catch((error) => {
        console.error(`Description not found: ${error}`);
      });
  };

  // funzione che crea la modale con la descrizione
  const createModal = function (title, description) {
    const modal = document.createElement("div");
    modal.className = "modal";
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    document.body.appendChild(overlay);
    const contentContainer = document.createElement("div");
    contentContainer.className = "content-container";

    const h1TitleModal = document.createElement("h1");
    h1TitleModal.innerText = title;
    contentContainer.appendChild(h1TitleModal);
    const h2AuthorModal = document.createElement("h2");
    h2AuthorModal.innerText = authors;
    contentContainer.appendChild(h2AuthorModal);
    const descriptionModal = document.createElement("p");
    if (typeof description === "object") {
      descriptionModal.innerText =
        description.value || "Description is not available";
    } else {
      // Se la descrizione è una stringa, utilizzala direttamente
      descriptionModal.innerText =
        description || "Description is not available";
    }
    descriptionModal.className = "description";
    contentContainer.appendChild(descriptionModal);

    //create and append close description button
    const btnClose = document.createElement("button");
    btnClose.type = "button";
    btnClose.className = "btn-close";
    btnClose.innerText = "Close";
    contentContainer.appendChild(btnClose);
    modal.appendChild(contentContainer);
    // event listener per chiudere la modale quando si fa clic sul bottone
    btnClose.onclick = () => {
      modal.style.display = "none";
      overlay.remove();
    };

    document.body.appendChild(modal);
    modal.style.display = "block";
  };

  card.appendChild(btnDescription);

  return card;
};
