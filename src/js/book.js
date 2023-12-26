import "../scss/main.scss";
import _ from "lodash";
import axios from "axios";
const displayCategory = document.querySelector(".category");

window.addEventListener("load", function () {
  const jsonData = JSON.parse(localStorage.getItem("jsonData"));
  const inputSubject = localStorage.getItem("inputSubject");

  if (jsonData && inputSubject) {
    console.log(jsonData);
    displayCategory.innerHTML = inputSubject;
    localStorage.removeItem("jsonData");
    localStorage.removeItem("inputSubject");
  } else {
    console.log("Nessun dato JSON nel Local Storage");
  }
});
