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
    console.log(arrayBooks);
    arrayBooks.forEach((element) => {
      const bookCard = createCard(
        element.cover_id,
        element.title,
        element.authors[0].name,
        element.description
      );
      containerCards.appendChild(bookCard);
      sectionCards.appendChild(containerCards);
    });

    localStorage.removeItem("jsonData");
    localStorage.removeItem("inputSubject");
  } else {
    console.log("Nessun dato JSON nel Local Storage");
  }
});

const createCard = function (image, title, authors, description) {
  let card = document.createElement("div");
  card.className = "card-book";
  //create and append image container
  const imgContainer = document.createElement("div");
  imgContainer.className = "container-img-book";
  if (image) {
    const img = document.createElement("img");
    // img.src = image;
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
  btnDescription.onclick = () => alert(description);
  card.appendChild(btnDescription);

  return card;
  //append the card to the container in my html
};
