/* =========================
   DATA IMPORT
   ========================= */

import { catsData } from "/data.js";

/* =========================
   DOM ELEMENT REFERENCES
   ========================= */

const emotionRadios = document.getElementById("emotion-radios");
const getImageBtn = document.getElementById("get-image-btn");
const gifsOnlyOption = document.getElementById("gifs-only-option");
const memeModalInner = document.getElementById("meme-modal-inner");
const memeModal = document.getElementById("meme-modal");
const memeModalCloseBtn = document.getElementById("meme-modal-close-btn");
const overlay = document.getElementById("overlay");

/* =========================
   EVENT LISTENERS
   ========================= */

/* Highlight selected radio option */
emotionRadios.addEventListener("change", highlightCheckedOption);

/* Open modal and render image */
getImageBtn.addEventListener("click", renderCat);

/* Close modal via close button */
memeModalCloseBtn.addEventListener("click", closeModal);

/* Close modal when clicking outside (overlay) */
overlay.addEventListener("click", closeModal);

/* Prevent modal clicks from bubbling to overlay */
memeModal.addEventListener("click", (e) => {
  e.stopPropagation();
});

/* =========================
   UI STATE FUNCTIONS
   ========================= */

/**
 * Highlights the selected radio option
 * Removes highlight from all radios and
 * applies it only to the selected one
 */
function highlightCheckedOption(e) {
  const radios = document.getElementsByClassName("radio");

  for (let radio of radios) {
    radio.classList.remove("highlight");
  }

  document.getElementById(e.target.id).parentElement.classList.add("highlight");
}

/**
 * Closes the modal and hides the overlay
 */
function closeModal() {
  memeModal.style.display = "none";
  overlay.classList.remove("active");
}

/**
 * Renders a random cat image inside the modal
 * based on selected emotion and GIF preference
 */

function renderCat() {
  const catObject = getSingleCatObject();

  memeModalInner.innerHTML = `
    <img 
      class="cat-img" 
      src="./images/${catObject.image}"
      alt="${catObject.alt}"
    >
  `;

  memeModal.style.display = "flex";
  overlay.classList.add("active");
}

/* =========================
   DATA PROCESSING FUNCTIONS
   ========================= */

/**
 * Returns a single cat object
 * If multiple matches exist, one is chosen randomly
 */
function getSingleCatObject() {
  const catsArray = getMatchingCatsArray();

  if (catsArray.length === 1) {
    return catsArray[0];
  }

  const randomNumber = Math.floor(Math.random() * catsArray.length);
  return catsArray[randomNumber];
}

/**
 * Filters cats based on:
 * - Selected emotion (radio)
 * - GIF only checkbox
 */
function getMatchingCatsArray() {
  const selectedRadio = document.querySelector('input[type="radio"]:checked');

  if (selectedRadio) {
    const selectedEmotion = selectedRadio.value;
    const isGif = gifsOnlyOption.checked;

    return catsData.filter((cat) => {
      if (isGif) {
        return cat.emotionTags.includes(selectedEmotion) && cat.isGif;
      }
      return cat.emotionTags.includes(selectedEmotion);
    });
  }
}

/**
 * Extracts a unique list of emotions from cats data
 */
function getEmotionsArray(cats) {
  const emotionsArray = [];

  for (let cat of cats) {
    for (let emotion of cat.emotionTags) {
      if (!emotionsArray.includes(emotion)) {
        emotionsArray.push(emotion);
      }
    }
  }

  return emotionsArray;
}

/* =========================
   RENDER FUNCTIONS
   ========================= */

/**
 * Dynamically renders emotion radio buttons
 * based on available emotions in cats data
 */
function renderEmotionsRadios(cats) {
  let radioItems = ``;
  const emotions = getEmotionsArray(cats);

  for (let emotion of emotions) {
    radioItems += `
      <div class="radio">
        <label for="${emotion}">${emotion}</label>
        <input
          type="radio"
          id="${emotion}"
          value="${emotion}"
          name="emotions"
        >
      </div>
    `;
  }

  emotionRadios.innerHTML = radioItems;
}

/* =========================
   INITIALIZATION
   ========================= */

/* Render emotion radios on page load */
renderEmotionsRadios(catsData);
