const nextStepBtn = document.getElementById("next-step-btn");
let selectedDate = sessionStorage.getItem("selectedDate") || null;
let selectedTime = sessionStorage.getItem("selectedTime") || null;

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
    sessionStorage.setItem("selectedDate", dateStr);
    updateButtonState();
  }
});

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
    sessionStorage.setItem("selectedTime", timeStr); 
    updateButtonState();
  }
});

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

function add30Minutes(timeStr) {
  let [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  minutes += 30;
  if (minutes >= 60) {
    minutes -= 60;
    hours += 1;
  }
  if (hours === 12) {
    period = period === "AM" ? "PM" : "AM"; 
  } else if (hours > 12) {
    hours -= 12; 
  } else if (hours === 0) {
    hours = 12; 
  }

  return `${timeStr} - ${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

nextStepBtn.addEventListener("click", () => {
  step1.classList.add("hidden");
  step2.classList.remove("hidden");

  stepIndicator[0].classList.remove("active");
  stepIndicator[1].classList.add("active");

  const selectedTime = sessionStorage.getItem("selectedTime") || "N/A";
  const selectedDate = sessionStorage.getItem("selectedDate") || "N/A";
  const timeRange = add30Minutes(selectedTime);

  sessionStorage.setItem("selectedTimeRange", timeRange);
  sessionStorage.setItem("selectedDateFormatted", `${selectedDate}`);

  timeRangeEl.innerText = timeRange;
  dateEl.innerText = `${selectedDate}`;
});

document.addEventListener("DOMContentLoaded", () => {
  timeRangeEl.innerText = sessionStorage.getItem("selectedTimeRange") || "N/A";
  dateEl.innerText = sessionStorage.getItem("selectedDateFormatted") || "N/A";
});

prevStepBtn.addEventListener("click", () => {
  step2.classList.add("hidden");
  step1.classList.remove("hidden");

  stepIndicator[1].classList.remove("active");
  stepIndicator[0].classList.add("active");
});

const step3 = document.getElementById("step-3");
const toStep3Btn = document.getElementById("to-step-3");
const prevStep3Btn = document.getElementById("prev-step-3");

toStep3Btn.addEventListener("click", () => {
  step2.classList.add("hidden");
  step3.classList.remove("hidden");

  stepIndicator[1].classList.remove("active");
  stepIndicator[2].classList.add("active");
});

toStep3Btn.addEventListener("click", () => {
  step2.classList.add("hidden");
  step3.classList.remove("hidden");

  stepIndicator[1].classList.remove("active");
  stepIndicator[2].classList.add("active");
});

prevStep3Btn.addEventListener("click", () => {
  step3.classList.add("hidden");
  step2.classList.remove("hidden");

  stepIndicator[2].classList.remove("active");
  stepIndicator[1].classList.add("active");
});


document.addEventListener("DOMContentLoaded", () => {
  const fullNameInput = document.getElementById("full-name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const continueBtn = document.getElementById("to-step-3");

  function validateFullName() {
    const fullName = fullNameInput.value.trim();
    const nameRegex = /^[A-Za-z\s]+$/; 
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

  function validateEmail() {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
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

  function validatePhone() {
    const phone = phoneInput.value.trim();
    const phoneRegex = /^\d{11}$/; 
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

  function showError(input, message) {
    let errorSpan = input.parentNode.querySelector(".error-message");
    if (!errorSpan) {
      errorSpan = document.createElement("span");
      errorSpan.classList.add("error-message");
      input.parentNode.appendChild(errorSpan);
    }
    errorSpan.innerText = message;
    input.classList.add("error"); 
  }

  function hideError(input) {
    const errorSpan = input.parentNode.querySelector(".error-message");
    if (errorSpan) {
      errorSpan.remove();
    }
    input.classList.remove("error"); 
  }

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

  window.addEventListener("load", () => {
    fullNameInput.value = sessionStorage.getItem("fullName") || "";
    emailInput.value = sessionStorage.getItem("email") || "";
    phoneInput.value = sessionStorage.getItem("phone") || "";
    updateButtonState();
  });
});
const prevStep2Btn = document.getElementById("prev-step-2");


document.getElementById("to-step-3").addEventListener("click", () => {
  step2.classList.add("hidden");
  step3.classList.remove("hidden");

  stepIndicator[1].classList.remove("active");
  stepIndicator[2].classList.add("active");

  document.getElementById("time-range").innerText = sessionStorage.getItem("selectedTimeRange") || "N/A";
  document.getElementById("display-date").innerText = sessionStorage.getItem("selectedDate") || "N/A";
  document.getElementById("display-name").innerText = sessionStorage.getItem("fullName") || "N/A";
  document.getElementById("display-email").innerText = sessionStorage.getItem("email") || "N/A";
  document.getElementById("display-phone").innerText = sessionStorage.getItem("phone") || "N/A";
});

document.addEventListener("DOMContentLoaded", () => {
  const serviceForm = document.getElementById("service-form");
  const submitBtn = document.getElementById("submit-btn");
  const serviceError = document.getElementById("service-error");
  const step3 = document.getElementById("step-3");
  const step4 = document.getElementById("step-4");

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

  function checkServices() {
    const checkedServices = document.querySelectorAll('input[name="services"]:checked');
    submitBtn.disabled = checkedServices.length === 0;
    return checkedServices.length > 0;
  }

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

  serviceForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!checkServices()) {
      serviceError.innerText = "Please select at least one service.";
      return;
    }
    sessionStorage.setItem("formSubmitted", "true");

    step3.classList.add("hidden");
    step4.classList.remove("hidden");
  });

  checkServices();
});


const submitBtn = document.getElementById("submit-btn");

submitBtn.addEventListener("click", () => {
  sessionStorage.setItem("formSubmitted", "true");

  document.getElementById("step-3").classList.add("hidden");
  document.getElementById("step-4").classList.remove("hidden");

  document.getElementById("selected-time-range").innerText = `${sessionStorage.getItem("selectedTimeRange") || "N/A"}`;
  document.getElementById("select-date").innerText = `${sessionStorage.getItem("selectedDate") || "N/A"}`;
  document.getElementById("retrieved-full-name").innerText = sessionStorage.getItem("fullName") || "N/A";
  document.getElementById("retrieved-email").innerText = sessionStorage.getItem("email") || "N/A";
  document.getElementById("retrieved-phone").innerText = sessionStorage.getItem("phone") || "N/A";

  const services = JSON.parse(sessionStorage.getItem("selectedServices") || "[]");
  document.getElementById("retrieved-services").innerText = services.length ? services.join(", ") : "N/A";

  document.getElementById("retrieved-guests").innerText = sessionStorage.getItem("guests") || "None";
  document.getElementById("retrieved-description").innerText = sessionStorage.getItem("description") || "None";
});
