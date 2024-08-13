$(document).ready(function () {
  let selectedAmenities = {};

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

  // Call the function to check the API status on page load
  checkApiStatus();

  // Event listener for checkbox changes
  $('input[type="checkbox"]').change(function () {
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
  });
});
