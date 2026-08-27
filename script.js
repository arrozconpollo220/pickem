const form = document.getElementById("pickemForm");
const contentWrapper = document.getElementById("contentWrapper");
const customAlert = document.getElementById("customAlert");
const closeAlertBtn = document.getElementById("closeAlert");
const venmoLink = document.getElementById("venmoLink");

emailjs.init("ZB4difRsgRgAQKiWH");

// Clear error status when selection changes
document.querySelectorAll(".game input[type=radio]").forEach(input => {
  input.addEventListener("change", function() {
    this.closest(".game").classList.remove("error");
  });
});

const closeModal = () => {
  customAlert.style.display = "none";
  contentWrapper.style.filter = "";
};

closeAlertBtn.addEventListener("click", closeModal);
venmoLink.addEventListener("click", closeModal);

form.addEventListener("submit", function(event) {
  event.preventDefault();
  
  // Clear any existing error highlights
  document.querySelectorAll(".game").forEach(g => g.classList.remove("error"));

  const name = document.getElementById("username").value.trim();
  if (!name) {
    alert("You forgot to enter your name and EMAIL!");
    return;
  }

  let picksList = [];
  let allPicked = true;
  let firstUnpickedGame = null;

  for (let i = 0; i <= 15; i++) {
    const sel = document.querySelector(`input[name="game${i}"]:checked`);
    const gameDiv = document.querySelector(`input[name="game${i}"]`).closest(".game");
    
    if (!sel) {
      allPicked = false;
      gameDiv.classList.add("error");
      if (!firstUnpickedGame) {
        firstUnpickedGame = gameDiv;
      }
    } else {
      picksList.push(`Game ${i + 1}: ${sel.value}`);
    }
  }

  const tiebreaker = document.getElementById("tiebreaker").value;
  const numTB = Number(tiebreaker);

  if (tiebreaker === "" || isNaN(numTB) || numTB < 0 || numTB > 200) {
    alert("Please enter a tie-breaker between 0 and 200.");
    return;
  }

  if (!allPicked) {
    firstUnpickedGame.scrollIntoView({ behavior: "smooth", block: "center" });
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

  // Save picks to localStorage
  let allEntries = JSON.parse(localStorage.getItem("weeklyPicks")) || [];
  allEntries.push({
    name: name,
    picks: picksList,
    tiebreaker: tiebreaker,
    timestamp: new Date().toLocaleString()
  });

  localStorage.setItem("weeklyPicks", JSON.stringify(allEntries));

  // Show modal alert & blur main wrapper
  customAlert.style.display = "flex";
  contentWrapper.style.filter = "blur(10px)";
  form.reset();
  
  // Reset switch thumb visibility after form reset
  document.querySelectorAll(".slide-switch").forEach(sw => {
    const thumb = sw.querySelector(".switch-thumb");
    if (thumb) thumb.style.opacity = "0";
  });
});