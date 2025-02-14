const nextStepBtn = document.getElementById("next-step-btn");
let selectedDate = sessionStorage.getItem("selectedDate") || null;
let selectedTime = sessionStorage.getItem("selectedTime") || null;

// Display saved values if they exist
if (selectedDate) {
  document.getElementById("selected-date").innerText = selectedDate;
}
if (selectedTime) {
  document.getElementById("selected-time").innerText = selectedTime;
}
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

flatpickr("#appointment-calendar", {
  inline: true,
  enableTime: false,
  dateFormat: "l, F j, Y",
  disable: [tomorrow],
  minDate: "today",
  onDayCreate: function(dObj, dStr, fp, dayElem) {
    const date = new Date(dayElem.dateObj);
    if (date.toDateString() === tomorrow.toDateString()) {
      dayElem.classList.add("unavailable-day");
    }
  },
  onChange: function (selectedDates, dateStr) {
    selectedDate = dateStr;
    document.getElementById("selected-date").innerText = dateStr;
    sessionStorage.setItem("selectedDate", dateStr); // Save to session storage
    updateButtonState();
  }
});

// Initialize Time Picker
flatpickr("#appointment-time", {
  inline: true,
  enableTime: true,
  noCalendar: true,
  dateFormat: "h:i K",
  time_24hr: false,
  minuteIncrement: 30,
  onChange: function (selectedDates, timeStr) {
    selectedTime = timeStr;
    document.getElementById("selected-time").innerText = timeStr;
    sessionStorage.setItem("selectedTime", timeStr); // Save to session storage
    updateButtonState();
  }
});

// Function to Enable Button if Both Date & Time are Selected
function updateButtonState() {
  if (selectedDate && selectedTime) {
    nextStepBtn.disabled = false;
    nextStepBtn.classList.add("enabled");
  } else {
    nextStepBtn.disabled = true;
    nextStepBtn.classList.remove("enabled");
  }
}

updateButtonState();


const prevStepBtn = document.getElementById("prev-step");
const step1 = document.getElementById("step-1");
const step2 = document.getElementById("step-2");
const stepIndicator = document.querySelectorAll(".step");
const timeRangeEl = document.getElementById("appointment-time-range");
const dateEl = document.getElementById("appointment-date");

// Function to Add 30 Minutes to Time
function add30Minutes(timeStr) {
  let [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  // Add 30 minutes
  minutes += 30;
  if (minutes >= 60) {
    minutes -= 60;
    hours += 1;
  }

  // Handle AM/PM transition
  if (hours === 12) {
    period = period === "AM" ? "PM" : "AM"; // Toggle AM/PM
  } else if (hours > 12) {
    hours -= 12; // Convert to 12-hour format
  } else if (hours === 0) {
    hours = 12; // Convert 0 to 12 for 12 AM
  }

  return `${timeStr} - ${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

// Show Next Step
nextStepBtn.addEventListener("click", () => {
  step1.classList.add("hidden");
  step2.classList.remove("hidden");

  // Update step indicator
  stepIndicator[0].classList.remove("active");
  stepIndicator[1].classList.add("active");

  // Retrieve Time & Date from Session Storage
  const selectedTime = sessionStorage.getItem("selectedTime") || "N/A";
  const selectedDate = sessionStorage.getItem("selectedDate") || "N/A";
  const timeRange = add30Minutes(selectedTime);

  // Save to session storage
  sessionStorage.setItem("selectedTimeRange", timeRange);
  sessionStorage.setItem("selectedDateFormatted", `${selectedDate}`);

  // Update UI immediately
  timeRangeEl.innerText = timeRange;
  dateEl.innerText = `${selectedDate}`;
});

// Ensure data is retrieved when user refreshes or navigates back
document.addEventListener("DOMContentLoaded", () => {
  timeRangeEl.innerText = sessionStorage.getItem("selectedTimeRange") || "N/A";
  dateEl.innerText = sessionStorage.getItem("selectedDateFormatted") || "N/A";
});

// Go Back to Step 1
prevStepBtn.addEventListener("click", () => {
  step2.classList.add("hidden");
  step1.classList.remove("hidden");

  // Update step indicator
  stepIndicator[1].classList.remove("active");
  stepIndicator[0].classList.add("active");
});

const step3 = document.getElementById("step-3");
const toStep3Btn = document.getElementById("to-step-3");
const prevStep3Btn = document.getElementById("prev-step-3");

// Go to Step 3
toStep3Btn.addEventListener("click", () => {
  step2.classList.add("hidden");
  step3.classList.remove("hidden");

  // Update step indicator
  stepIndicator[1].classList.remove("active");
  stepIndicator[2].classList.add("active");
});

// Go to Step 3
toStep3Btn.addEventListener("click", () => {
  step2.classList.add("hidden");
  step3.classList.remove("hidden");

  // Update step indicator
  stepIndicator[1].classList.remove("active");
  stepIndicator[2].classList.add("active");
});

// Go Back to Step 2
prevStep3Btn.addEventListener("click", () => {
  step3.classList.add("hidden");
  step2.classList.remove("hidden");

  // Update step indicator
  stepIndicator[2].classList.remove("active");
  stepIndicator[1].classList.add("active");
});


document.addEventListener("DOMContentLoaded", () => {
  const fullNameInput = document.getElementById("full-name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const continueBtn = document.getElementById("to-step-3");

  // Function to Validate Full Name
  function validateFullName() {
    const fullName = fullNameInput.value.trim();
    const nameRegex = /^[A-Za-z\s]+$/; // Only letters and spaces allowed
    if (fullName === "") {
      showError(fullNameInput, "Full name is required");
      return false;
    } else if (!nameRegex.test(fullName)) {
      showError(fullNameInput, "Only letters are allowed");
      return false;
    }
    hideError(fullNameInput);
    sessionStorage.setItem("fullName", fullName);
    return true;
  }

  // Function to Validate Email
  function validateEmail() {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format
    if (email === "") {
      showError(emailInput, "Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      showError(emailInput, "Enter a valid email address");
      return false;
    }
    hideError(emailInput);
    sessionStorage.setItem("email", email);
    return true;
  }

  // Function to Validate Phone Number
  function validatePhone() {
    const phone = phoneInput.value.trim();
    const phoneRegex = /^\d{11}$/; // Exactly 11 digits
    if (phone === "") {
      showError(phoneInput, "Phone number is required");
      return false;
    } else if (!phoneRegex.test(phone)) {
      showError(phoneInput, "Phone number must be 11 digits");
      return false;
    }
    hideError(phoneInput);
    sessionStorage.setItem("phone", phone);
    return true;
  }

  // Show Error Message and Add Red Border
  function showError(input, message) {
    let errorSpan = input.parentNode.querySelector(".error-message");
    if (!errorSpan) {
      errorSpan = document.createElement("span");
      errorSpan.classList.add("error-message");
      input.parentNode.appendChild(errorSpan);
    }
    errorSpan.innerText = message;
    input.classList.add("error"); // Add red border
  }

  // Hide Error Message and Remove Red Border
  function hideError(input) {
    const errorSpan = input.parentNode.querySelector(".error-message");
    if (errorSpan) {
      errorSpan.remove();
    }
    input.classList.remove("error"); // Remove red border
  }

  // Enable Button if All Fields Are Valid
  function updateButtonState() {
    const isFullNameValid = fullNameInput.value && !fullNameInput.classList.contains("error");
    const isEmailValid = emailInput.value && !emailInput.classList.contains("error");
    const isPhoneValid = phoneInput.value && !phoneInput.classList.contains("error");

    if (isFullNameValid && isEmailValid && isPhoneValid) {
      continueBtn.disabled = false;
      continueBtn.classList.add("enabled");
    } else {
      continueBtn.disabled = true;
      continueBtn.classList.remove("enabled");
    }
  }
  
  fullNameInput.addEventListener("blur", () => {
    validateFullName();
    updateButtonState();
  });
  emailInput.addEventListener("blur", () => {
    validateEmail();
    updateButtonState();
  });
  phoneInput.addEventListener("blur", () => {
    validatePhone();
    updateButtonState();
  });

  fullNameInput.addEventListener("focus", () => hideError(fullNameInput));
  emailInput.addEventListener("focus", () => hideError(emailInput));
  phoneInput.addEventListener("focus", () => hideError(phoneInput));

  // Load Saved Values from Session Storage
  window.addEventListener("load", () => {
    fullNameInput.value = sessionStorage.getItem("fullName") || "";
    emailInput.value = sessionStorage.getItem("email") || "";
    phoneInput.value = sessionStorage.getItem("phone") || "";
    updateButtonState();
  });
});
const prevStep2Btn = document.getElementById("prev-step-2");


// Show Step 3 when "Continue" button in Step 2 is clicked
document.getElementById("to-step-3").addEventListener("click", () => {
  step2.classList.add("hidden");
  step3.classList.remove("hidden");

  // Update step indicator
  stepIndicator[1].classList.remove("active");
  stepIndicator[2].classList.add("active");

  // Retrieve Data from Session Storage
  document.getElementById("time-range").innerText = sessionStorage.getItem("selectedTimeRange") || "N/A";
  document.getElementById("display-date").innerText = sessionStorage.getItem("selectedDate") || "N/A";
  document.getElementById("display-name").innerText = sessionStorage.getItem("fullName") || "N/A";
  document.getElementById("display-email").innerText = sessionStorage.getItem("email") || "N/A";
  document.getElementById("display-phone").innerText = sessionStorage.getItem("phone") || "N/A";
});
/*
document.addEventListener("DOMContentLoaded", () => {
  const serviceForm = document.getElementById("service-form");
  const submitBtn = document.getElementById("submit-btn");
  const serviceError = document.getElementById("service-error");

  // Function to check if at least one service checkbox is checked
  function checkServices() {
    const checkedServices = document.querySelectorAll('input[name="services"]:checked');
    if (checkedServices.length === 0) {
      submitBtn.disabled = true;
      return false;
    } else {
      submitBtn.disabled = false;
      return true;
    }
  }

  // Add event listeners to all service checkboxes
  document.querySelectorAll('input[name="services"]').forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      serviceError.innerText = "";
      checkServices();
    });
  });

  // Form submission
  serviceForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Validate at least one service is checked
    if (!checkServices()) {
      serviceError.innerText = "Please select at least one service.";
      return;
    }

    // Retrieve all selected services as an array of values
    const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked')).map(cb => cb.value);
    
    // Retrieve optional guests and description
    const guests = document.getElementById("guests").value.trim();
    const description = document.getElementById("description").value.trim();

    // Save to session storage
    sessionStorage.setItem("selectedServices", JSON.stringify(selectedServices));
    sessionStorage.setItem("guests", guests);
    sessionStorage.setItem("description", description);

    // For now, simply log or display a confirmation message
    alert("Services submitted successfully!");
    // Here you can also move to the next step if needed.
  });

  // Initial check when page loads
  checkServices();
});

document.addEventListener("DOMContentLoaded", () => {
  const serviceForm = document.getElementById("service-form");
  const submitBtn = document.getElementById("submit-btn");
  const serviceError = document.getElementById("service-error");

  // --- Load Stored Values from Session Storage ---
  const storedServices = sessionStorage.getItem("selectedServices");
  if (storedServices) {
    const selectedServices = JSON.parse(storedServices);
    // Mark checkboxes as checked if they were previously selected
    document.querySelectorAll('input[name="services"]').forEach((checkbox) => {
      if (selectedServices.includes(checkbox.value)) {
        checkbox.checked = true;
      }
    });
  }
  const storedGuests = sessionStorage.getItem("guests");
  if (storedGuests) {
    document.getElementById("guests").value = storedGuests;
  }
  const storedDescription = sessionStorage.getItem("description");
  if (storedDescription) {
    document.getElementById("description").value = storedDescription;
  }
  
  // --- Function to Check if at Least One Service is Selected ---
  function checkServices() {
    const checkedServices = document.querySelectorAll('input[name="services"]:checked');
    if (checkedServices.length === 0) {
      submitBtn.disabled = true;
      return false;
    } else {
      submitBtn.disabled = false;
      return true;
    }
  }

  // --- Add Event Listeners to Service Checkboxes ---
  document.querySelectorAll('input[name="services"]').forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      serviceError.innerText = "";
      checkServices();
      // Save current selected services to session storage
      const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked')).map(cb => cb.value);
      sessionStorage.setItem("selectedServices", JSON.stringify(selectedServices));
    });
  });

  // --- Save Guests and Description on Input ---
  document.getElementById("guests").addEventListener("input", (e) => {
    sessionStorage.setItem("guests", e.target.value);
  });
  document.getElementById("description").addEventListener("input", (e) => {
    sessionStorage.setItem("description", e.target.value);
  });

  // --- Form Submission ---
  serviceForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Validate at least one service is checked
    if (!checkServices()) {
      serviceError.innerText = "Please select at least one service.";
      return;
    }

    // Retrieve all selected services as an array of values
    const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked')).map(cb => cb.value);
    
    // Retrieve optional guests and description
    const guests = document.getElementById("guests").value.trim();
    const description = document.getElementById("description").value.trim();

    // Save to session storage
    sessionStorage.setItem("selectedServices", JSON.stringify(selectedServices));
    sessionStorage.setItem("guests", guests);
    sessionStorage.setItem("description", description);

    // For now, simply log or display a confirmation message
    alert("Services submitted successfully!");
    // Here you can also move to the next step if needed.
  });

  // --- Initial Check on Page Load ---
  checkServices();
});
*/

document.addEventListener("DOMContentLoaded", () => {
  const serviceForm = document.getElementById("service-form");
  const submitBtn = document.getElementById("submit-btn");
  const serviceError = document.getElementById("service-error");
  const step3 = document.getElementById("step-3");
  const step4 = document.getElementById("step-4");

  // --- Load Stored Values from Session Storage ---
  const storedServices = sessionStorage.getItem("selectedServices");
  if (storedServices) {
    const selectedServices = JSON.parse(storedServices);
    document.querySelectorAll('input[name="services"]').forEach((checkbox) => {
      if (selectedServices.includes(checkbox.value)) {
        checkbox.checked = true;
      }
    });
  }
  document.getElementById("guests").value = sessionStorage.getItem("guests") || "";
  document.getElementById("description").value = sessionStorage.getItem("description") || "";

  // --- Function to Check if at Least One Service is Selected ---
  function checkServices() {
    const checkedServices = document.querySelectorAll('input[name="services"]:checked');
    submitBtn.disabled = checkedServices.length === 0;
    return checkedServices.length > 0;
  }

  // --- Save Inputs on Change ---
  document.querySelectorAll('input[name="services"]').forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      serviceError.innerText = "";
      checkServices();
      const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked')).map(cb => cb.value);
      sessionStorage.setItem("selectedServices", JSON.stringify(selectedServices));
    });
  });
  document.getElementById("guests").addEventListener("input", (e) => sessionStorage.setItem("guests", e.target.value));
  document.getElementById("description").addEventListener("input", (e) => sessionStorage.setItem("description", e.target.value));

  // --- Form Submission ---
  serviceForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!checkServices()) {
      serviceError.innerText = "Please select at least one service.";
      return;
    }
    sessionStorage.setItem("formSubmitted", "true");

    // Move to Step 4 (Success Message)
    step3.classList.add("hidden");
    step4.classList.remove("hidden");
  });

  // --- Initial Check on Page Load ---
  checkServices();
});


/*
document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("formSubmitted") === "true") {
    document.getElementById("selected-time-range").innerText = `${sessionStorage.getItem("selectedTimeRange") || "N/A"}`;
    document.getElementById("select-date").innerText = `Date: ${sessionStorage.getItem("selectedDate") || "None"}`;
    document.getElementById("retrieved-full-name").innerText = sessionStorage.getItem("fullName") || "N/A";
    document.getElementById("retrieved-email").innerText = sessionStorage.getItem("email") || "N/A";
    document.getElementById("retrieved-phone").innerText = sessionStorage.getItem("phone") || "N/A";
    
    // Retrieve and format selected services
    const services = JSON.parse(sessionStorage.getItem("selectedServices") || "[]");
    document.getElementById("retrieved-services").innerText = services.length ? services.join(", ") : "N/A";

    document.getElementById("retrieved-guests").innerText = sessionStorage.getItem("guests") || "None";
    document.getElementById("retrieved-description").innerText = sessionStorage.getItem("description") || "None";
  }
});
*/

const submitBtn = document.getElementById("submit-btn");

submitBtn.addEventListener("click", () => {
  // Mark that the form was submitted
  sessionStorage.setItem("formSubmitted", "true");

  // Move to Step 4
  document.getElementById("step-3").classList.add("hidden");
  document.getElementById("step-4").classList.remove("hidden");

  // Retrieve and Display Data in Real-Time
  document.getElementById("selected-time-range").innerText = `${sessionStorage.getItem("selectedTimeRange") || "N/A"}`;
  document.getElementById("select-date").innerText = `${sessionStorage.getItem("selectedDate") || "N/A"}`;
  document.getElementById("retrieved-full-name").innerText = sessionStorage.getItem("fullName") || "N/A";
  document.getElementById("retrieved-email").innerText = sessionStorage.getItem("email") || "N/A";
  document.getElementById("retrieved-phone").innerText = sessionStorage.getItem("phone") || "N/A";

  // Retrieve and format selected services
  const services = JSON.parse(sessionStorage.getItem("selectedServices") || "[]");
  document.getElementById("retrieved-services").innerText = services.length ? services.join(", ") : "N/A";

  document.getElementById("retrieved-guests").innerText = sessionStorage.getItem("guests") || "None";
  document.getElementById("retrieved-description").innerText = sessionStorage.getItem("description") || "None";
});


