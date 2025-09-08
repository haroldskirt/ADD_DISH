
const form = document.getElementById("dish-form");
const dishList = document.getElementById("dish-list");

let dishes = JSON.parse(localStorage.getItem("dishes")) || [];

function saveDishes() {
  localStorage.setItem("dishes", JSON.stringify(dishes));
}

function createAverageStars(avgRating, totalRatings) {
  const container = document.createElement("p");
  container.className = "average-rating";

  const fullStars = Math.floor(avgRating);
  const halfStar = (avgRating - fullStars) >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  for (let i = 0; i < fullStars; i++) {
    const star = document.createElement("span");
    star.textContent = "★";
    star.style.color = "#f5c518";
    star.style.fontSize = "22px";
    container.appendChild(star);
  }

  if (halfStar) {
    const half = document.createElement("span");
    half.textContent = "☆"; // fallback empty star
    half.style.position = "relative";
    half.style.display = "inline-block";
    half.style.color = "#f5c518";
    half.style.fontSize = "22px";
    half.style.background = `linear-gradient(90deg, #f5c518 50%, transparent 50%)`;
    half.style.webkitBackgroundClip = "text";
    half.style.webkitTextFillColor = "transparent";

    container.appendChild(half);
  }

  for (let i = 0; i < emptyStars; i++) {
    const star = document.createElement("span");
    star.textContent = "☆";
    star.style.color = "#ccc";
    star.style.fontSize = "22px";
    container.appendChild(star);
  }

  const countText = document.createElement("span");
  countText.textContent = ` (${totalRatings} rating${totalRatings !== 1 ? "s" : ""})`;
  countText.style.marginLeft = "8px";
  countText.style.fontSize = "14px";
  countText.style.color = "#555";
  container.appendChild(countText);

  return container;
}

function createStarRating(ratings, onRate) {
  const container = document.createElement("div");
  container.className = "star-rating";

  // Calculate average rating for display
  let avgRating = 0;
  if (ratings.length > 0) {
    avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  }

  // Display average stars (filled and empty)
  const avgStars = createAverageStars(avgRating, ratings.length);
  container.appendChild(avgStars);

  // Interactive stars for rating
  const interactiveStars = document.createElement("div");
  interactiveStars.className = "interactive-stars";

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.className = "star";
    star.textContent = "☆"; // empty star by default
    star.style.cursor = "pointer";
    star.dataset.value = i;

    star.addEventListener("mouseenter", () => {
      highlightStars(interactiveStars, i);
    });
    star.addEventListener("mouseleave", () => {
      highlightStars(interactiveStars, 0);
    });
    star.addEventListener("click", () => {
      onRate(i);
    });

    interactiveStars.appendChild(star);
  }

  container.appendChild(interactiveStars);

  return container;
}

function highlightStars(container, count) {
  const stars = container.querySelectorAll(".star");
  stars.forEach((star, idx) => {
    star.textContent = idx < count ? "★" : "☆";
  });
}

function renderDishes() {
  dishList.innerHTML = "";
  if (dishes.length === 0) {
    const noDishes = document.createElement("p");
    noDishes.className = "no-dishes";
    noDishes.textContent = "No dishes posted yet.";
    dishList.appendChild(noDishes);
    return;
  }

  dishes.forEach((dish, index) => {
    const li = document.createElement("li");
    li.className = "dish-item";

    const img = document.createElement("img");
    img.src = dish.image;
    img.alt = dish.description;
    img.className = "dish-image";

    const desc = document.createElement("p");
    desc.className = "dish-description";
    desc.textContent = dish.description;

    li.appendChild(img);
    li.appendChild(desc);

    // Append star rating widget (includes average stars and interactive stars)
    const starRating = createStarRating(dish.ratings, (ratingValue) => {
      dishes[index].ratings.push(ratingValue);
      saveDishes();
      renderDishes();
      alert("Thanks for rating!");
    });

    li.appendChild(starRating);

    dishList.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const descriptionInput = document.getElementById("description");
  const imageInput = document.getElementById("image");

  const description = descriptionInput.value.trim();
  const imageFile = imageInput.files[0];

  if (!description || !imageFile) {
    alert("Please provide both description and image.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    dishes.push({ description, image: event.target.result, ratings: [] });
    saveDishes();
    renderDishes();
    form.reset();
  };

  reader.readAsDataURL(imageFile);
}

// Initial render
,renderDishes());
