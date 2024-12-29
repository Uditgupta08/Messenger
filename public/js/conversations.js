const searchInput = document.getElementById("searchInput");
const suggestionsList = document.getElementById("suggestionsList");

searchInput.addEventListener("input", async (event) => {
  const query = event.target.value;
  if (!query) {
    suggestionsList.style.display = "none"; // Hide suggestions when input is empty
    return;
  }
  try {
    const response = await fetch(`/conversations/search?username=${query}`);
    const data = await response.json();
    suggestionsList.innerHTML = "";
    data.users.forEach((user) => {
      const listItem = document.createElement("li");
      listItem.textContent = user.username;
      listItem.addEventListener("click", () => {
        searchInput.value = user.username;
        suggestionsList.style.display = "none";
        const token = localStorage.getItem("authToken");
        if (token) {
          window.location.href = `/conversations/chat/${user._id}`;
        } else {
          window.location.href = "/login";
        }
      });

      suggestionsList.appendChild(listItem);
    });

    suggestionsList.style.display = "block"; // Show suggestions
  } catch (error) {
    console.error("Error fetching search results:", error);
  }
});
