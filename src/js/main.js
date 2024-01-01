import _ from "lodash";
import "../scss/main.scss";
import axios from "axios";

document.addEventListener("DOMContentLoaded", function () {
  const buttonSearch = document.querySelector(".btn-search");
  const inputCategory = document.querySelector("#site-search");

  const isValidCategory = function (input) {
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
    const normalizedInput = input.toLowerCase();
    return validCategories.includes(normalizedInput);
  };

  const getCategory = async function () {
    const inputSubject = inputCategory.value;

    if (!isValidCategory(inputSubject)) {
      alert("Invalid input. Please enter a valid category.");
      return;
    }

    try {
      const response = await axios.get(
        `https://openlibrary.org/subjects/${inputSubject.toLowerCase()}.json?limit=72`
      );
      const jsonData = response.data;

      // Salva l'oggetto JSON nel Local Storage
      localStorage.setItem("jsonData", JSON.stringify(jsonData));
      localStorage.setItem("inputSubject", inputSubject);
      // Reindirizza alla pagina book.html
      window.location.href = "http://localhost:1234/book.html";
      inputCategory.value = "";
      return jsonData;
    } catch (error) {
      console.log(error);
    }
  };

  const btnSearchHandler = (event) => {
    if (event.key === "Enter" || event.type === "click") {
      btnSearch(event);
    }
  };

  if (buttonSearch) {
    buttonSearch.addEventListener("click", btnSearchHandler);
  }

  if (inputCategory) {
    inputCategory.addEventListener("keydown", btnSearchHandler);
  }

  function btnSearch(event) {
    event.preventDefault();
    getCategory();
  }

  preventImageDrag();
});

// drag-prevention.js
export function preventImageDrag() {
  const images = document.querySelectorAll("img");

  images.forEach(function (image) {
    image.addEventListener("dragstart", function (event) {
      event.preventDefault();
    });
  });
}
