import _ from "lodash";
import "../scss/main.scss";
import axios from "axios";

const buttonSearch = document.querySelector(".btn-search");
const inputCategory = document.querySelector("#site-search");

// axios
const getCategory = function () {
  const inputSubject = inputCategory.value;
  axios
    .get(`https://openlibrary.org/subjects/${inputSubject}.json`)
    .then((response) => {
      const jsonData = response.data;

      // Salva l'oggetto JSON nel Local Storage
      localStorage.setItem("jsonData", JSON.stringify(jsonData));
      localStorage.setItem("inputSubject", inputSubject);
      // Reindirizza alla pagina book.html
      window.location.href = "http://localhost:1234/book.html";
      inputCategory.value = "";
      return jsonData;
    })
    .catch((error) => {
      console.log(error);
    });
};

buttonSearch.addEventListener("click", (e) => {
  e.preventDefault();
  getCategory();
});
