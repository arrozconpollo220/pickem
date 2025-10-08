const form = document.getElementById("pickemForm");
const contentWrapper = document.getElementById("contentWrapper");
const customAlert = document.getElementById("customAlert");
const closeAlertBtn = document.getElementById("closeAlert");
const venmoLink = document.getElementById("venmoLink");

emailjs.init("ZB4difRsgRgAQKiWH");

// Remove red border when corrected
document.querySelectorAll(".game input[type=radio]").forEach(input => {
  input.addEventListener("change", function() {
    this.closest(".game").classList.remove("error");
  });
});

closeAlertBtn.addEventListener("click", () => {
  customAlert.style.display = "none";
  contentWrapper.style.filter = "";
});

venmoLink.addEventListener("click", () => {
  customAlert.style.display = "none";
  contentWrapper.style.filter = "";
});

form.addEventListener("submit", function(event) {
  event.preventDefault();
  document.querySelectorAll(".game").forEach(g => g.classList.remove("error"));

  const name = document.getElementById("username").value.trim();
  if (!name) {
    alert("You forgot to enter your name and EMAIL!");
    return;
  }

  let picksList = [];
  let allPicked = true;

  for (let i = 0; i <=14; i++) {
    const sel = document.querySelector(`input[name="game${i}"]:checked`);
    const gameDiv = document.querySelector(`input[name="game${i}"]`).closest(".game");
    if (!sel) {
      allPicked = false;
      gameDiv.classList.add("error");
    } else {
      picksList.push(`Game ${i + 1}: ${sel.value}`);
    }
  }

  const tiebreaker = document.getElementById("tiebreaker").value;
  const numTB = Number(tiebreaker);

  if (tiebreaker === "" || isNaN(numTB) || numTB < 0 || numTB > 100) {
    alert("Please enter a tie-breaker between 0 and 100.");
    return;
  }

  if (!allPicked) {
    alert("Please make a selection for all games before submitting.");
    return;
  }

  const picksFormatted = picksList.join("\n");
  const payload = { username: name, picks: picksFormatted, tiebreaker: tiebreaker };

  // Send to both EmailJS accounts
  emailjs.send("service_wpho2gf", "template_xrga1vs", payload)
    .then(() => console.log("Sent to Account Alex"), err => console.error(err));

  emailjs.send("service_9r97vcq", "template_n6ehca8", payload, "3RILetYOuA580VW_S")
    .then(() => console.log("Sent to Account Emily"), err => console.error(err));

  // Show modal & blur content
  customAlert.style.display = "flex";
  contentWrapper.style.filter = "blur(10px)";
  form.reset();
});
