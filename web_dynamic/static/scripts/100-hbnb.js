$(document).ready(function () {
  let selectedAmenities = {};
  let selectedStates = {};
  let selectedCities = {};

  // Function to check the API status
  function checkApiStatus() {
    const apiUrl = "http://0.0.0.0:5001/api/v1/status/";

    // Make a GET request to the API
    fetch(apiUrl)
      .then((response) => response.json()) // Parse the JSON from the response
      .then((data) => {
        // Check if the status is "OK"
        if (data.status === "OK") {
          $("#api_status").addClass("available"); // Add class 'available'
        } else {
          $("#api_status").removeClass("available"); // Remove class 'available'
        }
      })
      .catch((error) => {
        console.error("Error fetching API status:", error);
        $("#api_status").removeClass("available"); // Ensure class is removed on error
      });
  }

  // Function to fetch places data and update the UI
  function fetchPlaces() {
    const apiUrl = "http://0.0.0.0:5001/api/v1/places_search/";
    const amenitiesList = Object.keys(selectedAmenities);
    const statesList = Object.keys(selectedStates);
    const citiesList = Object.keys(selectedCities);

    // Send a POST request with selected amenities, states, and cities
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amenities: amenitiesList,
        states: statesList,
        cities: citiesList,
      }),
    })
      .then((response) => response.json()) // Parse the JSON from the response
      .then((places) => {
        const placesSection = $(".places");
        placesSection.empty(); // Clear existing content

        // Loop through the places and create article tags
        places.forEach((place) => {
          const article = `
                    <article>
                        <div class="title_box">
                            <h2>${place.name}</h2>
                            <div class="price_by_night">$${
                              place.price_by_night
                            }</div>
                        </div>
                        <div class="information">
                            <div class="max_guest">${place.max_guest} Guest${
            place.max_guest != 1 ? "s" : ""
          }</div>
                            <div class="number_rooms">${
                              place.number_rooms
                            } Bedroom${place.number_rooms != 1 ? "s" : ""}</div>
                            <div class="number_bathrooms">${
                              place.number_bathrooms
                            } Bathroom${
            place.number_bathrooms != 1 ? "s" : ""
          }</div>
                        </div>
                        <div class="description">${
                          place.description | safe
                        }</div>
                    </article>
                `;
          placesSection.append(article);
        });
      })
      .catch((error) => {
        console.error("Error fetching places:", error);
      });
  }

  // Call the function to check the API status on page load
  checkApiStatus();

  // Function to update the Locations h4 tag with selected states and cities
  function updateLocationsList() {
    const selectedStatesList = Object.values(selectedStates).join(", ");
    const selectedCitiesList = Object.values(selectedCities).join(", ");
    $(".locations h4").text(`${selectedStatesList}, ${selectedCitiesList}`);
  }

  // Event listener for checkbox changes
  $('input[type="checkbox"]').change(function () {
    const id = $(this).data("id");
    const name = $(this).data("name");

    if ($(this).closest("ul").hasClass("locations")) {
      // Handling states and cities
      if ($(this).closest("li").find("h2").length) {
        // It's a state
        if (this.checked) {
          selectedStates[id] = name;
        } else {
          delete selectedStates[id];
        }
      } else {
        // It's a city
        if (this.checked) {
          selectedCities[id] = name;
        } else {
          delete selectedCities[id];
        }
      }
      // Update the locations h4 tag
      updateLocationsList();
    } else {
      // Handling amenities
      const amenityId = $(this).data("id");
      const amenityName = $(this).data("name");

      if (this.checked) {
        selectedAmenities[amenityId] = amenityName;
      } else {
        delete selectedAmenities[amenityId];
      }

      // Update the h4 tag inside the div Amenities with the list of selected amenities
      const amenityList = Object.values(selectedAmenities).join(", ");
      $(".amenities h4").text(amenityList);
    }
  });

  // Event listener for the Search button
  $('button[type="button"]').click(function () {
    // Fetch places based on selected amenities, states, and cities when the button is clicked
    fetchPlaces();
  });
});
