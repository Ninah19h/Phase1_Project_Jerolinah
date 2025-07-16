//console.log("JavaScript connected!");
// for the scope issue
let editCountryId = null; // If this is set, we're editing
// instead of creating a new country card
let form = document.querySelector("form"); //moved here to fix scope issue

// SUBMIT EVENT FOR THE FORM
document.addEventListener("DOMContentLoaded", function () {
  //console.log("Form found:", form);

  // add event listener to the form
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // stops the form from reloading the page
    //alert("do you want to submit the form!"); // alert to confirm submission
    let confirmSubmit = confirm("Do you want to submit the form?");
    if (!confirmSubmit) return;

    //  Gather form data
    let fullName = document.querySelector("#full-name").value;
    let phoneNumber = document.querySelector("#phone-number").value;
    let startDate = document.querySelector("#start-date").value;
    let endDate = document.querySelector("#end-date").value;
    let emailAddress = document.querySelector("#email").value;
    let countryName = document.querySelector("#country-name").value;
    let travelStatus = document.querySelector("#travel-status").value;

    let formData = {
      fullName,
      phoneNumber,
      startDate,
      endDate,
      emailAddress,
      countryName,
      travelStatus,
    };

    if (editCountryId) {
      updateCountry(editCountryId, formData); //  Editing existing country
      editCountryId = null; // Reset after editing
    } else {
      createCountry(formData); // Save and show new country
    }

    form.reset(); // Clear form after submit
  });

  //  Fetch and display all saved countries
getCountries();
 // Show each saved card
      });
 
//console.log("Form submitted with name:", fullName);

// If user clicked Cancel
//console.log("Form submission cancelled by user.");

// Get the full name value using its ID
//let fullName = document.querySelector('#full-name').value;
//console.log("Full Name:", fullName);

// Get
// Creates and appends a travel card to the page
function displayCountry(data) {
  let startDate = new Date(data.startDate);
  let endDate = new Date(data.endDate);
  let totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  let card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
  <h2>Travel Card</h2>
  <p class="card-name">Name: ${data.fullName}</p>
  <p class="card-phone">Phone: ${data.phoneNumber}</p>
  <p>Duration: ${totalDays} days</p>
  <p class="card-status">Status: ${data.travelStatus}</p>
  <p class="card-country">Country: ${data.countryName}</p>
  <p class="card-email">Email: ${data.emailAddress}</p>
  <div class="card-buttons">
    <button class="edit-btn">Edit</button>
    <button class="delete-btn">Delete</button>
  </div>
`;


  let container = document.querySelector("#country-cards");
  container.appendChild(card);

  // DELETE BUTTON
  let deleteButton = card.querySelector(".delete-btn");

deleteButton.addEventListener("click", function () {
  deleteCountry(data.id, card);
});

  // EDIT BUTTON
  let editButton = card.querySelector(".edit-btn");

  editButton.addEventListener("click", function () {
    let name = card.querySelector(".card-name")?.textContent.replace("Name: ", "") || "";
    let phone = card.querySelector(".card-phone")?.textContent.replace("Phone: ", "") || "";
    let status = card.querySelector(".card-status")?.textContent.replace("Status: ", "") || "";
    let country = card.querySelector(".card-country")?.textContent.replace("Country: ", "") || "";
    let email = card.querySelector(".card-email")?.textContent.replace("Email: ", "") || "";

    document.querySelector("#full-name").value = name;
    document.querySelector("#phone-number").value = phone;
    document.querySelector("#travel-status").value = status;
    document.querySelector("#country-name").value = country;
    document.querySelector("#email").value = email;

    //  Save the ID of the country being edited
    editCountryId = data.id;

    form.scrollIntoView({ behavior: "smooth" });
    card.remove(); // remove old card temporarily, will be replaced after editing
  });
}

// FILTER BUTTONS
let filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(function (button) {
  //click event
  button.addEventListener("click", function () {
    //gets the filter value from the button
    let selectedFilter = button.dataset.filter;
    //console.log("You clicked:", selectedFilter); // Should say: Visited, Dreaming, or all in console
    console.log("You clicked:", selectedFilter);
    // finds all cards with the class card
    let allCards = document.querySelectorAll(".card");
    // gets thru all card one by one 
    allCards.forEach(function (card) {
      //This grabs the text of the Status line inside that card.
      let statusText = card.querySelector("p:nth-of-type(4)").textContent.replace("Status: ", "");
      //then If the button clicked is "all" or the card’s status matches what we clicke
      if (selectedFilter === "all" || statusText === selectedFilter) {
        //then show the card
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

//  GET all countries from json-server
function getCountries() {
  fetch("http://localhost:3000/countries", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((country) => {
        displayCountry(country); // Show each saved card
      });
    })
    .catch((error) => {
      console.error("Failed to fetch countries:", error);
      alert("Could not load countries from server.");
    });
}



//  Sends data to json-server and displays it on the page
function createCountry(data) {
  fetch("http://localhost:3000/countries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((newCountry) => {
      displayCountry(newCountry); // Shows the new country card
    });
}

//  DELETE from json-server and remove from page
function deleteCountry(id, cardElement) {
  fetch(`http://localhost:3000/countries/${id}`, {
    method: "DELETE",
  })
    .then(() => {
      cardElement.remove(); // Remove from DOM after successful delete
    })
    .catch((error) => {
      console.error("Failed to delete:", error);
      alert("Could not delete from server.");
    });
}


function updateCountry(id, data) {
  fetch(`http://localhost:3000/countries/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((updatedCountry) => {
      displayCountry(updatedCountry); //Show the updated version
    });
}
