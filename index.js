const BASE_URL = "https://simple-blog-post-manager-1.onrender.com/posts";

// DOM Elements
const postList = document.getElementById("post-list");
const postDetail = document.getElementById("post-detail");
const newPostForm = document.getElementById("new-post-form");
const editPostForm = document.getElementById("edit-post-form");
const cancelEditBtn = document.getElementById("cancel-edit");

// Load posts on page load
fetch(BASE_URL)
  .then(res => res.json())
  .then(posts => posts.forEach(renderPostTitle));

// Render post titles in list
function renderPostTitle(post) {
  const div = document.createElement("div");
  div.textContent = post.title;
  div.classList.add("post-title");
  div.style.cursor = "pointer";

  div.addEventListener("click", () => showPostDetail(post));
  postList.appendChild(div);
}

// Show post detail
function showPostDetail(post) {
  postDetail.innerHTML = `
    <h2>${post.title}</h2>
    <p>${post.content}</p>
    <p><strong>Author:</strong> ${post.author}</p>
    ${post.image ? `<img src="${post.image}" alt="${post.title}" width="300">` : ""}
    <br><br>
    <button id="edit-btn">Edit</button>
    <button id="delete-btn">Delete</button>
  `;

  // Attach event listeners
  document.getElementById("edit-btn").onclick = () => fillEditForm(post);
  document.getElementById("delete-btn").onclick = () => deletePost(post.id);
}

// Add New Post
newPostForm.addEventListener("submit", e => {
  e.preventDefault();

  const newPost = {
    title: newPostForm.title.value,
    content: newPostForm.content.value,
    author: newPostForm.author.value,
    image: newPostForm.image.value
  };

  fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPost)
  })
    .then(res => res.json())
    .then(post => {
      renderPostTitle(post);
      newPostForm.reset();
    });
});

// Fill Edit Form
function fillEditForm(post) {
  editPostForm.classList.remove("hidden");
  editPostForm["edit-id"].value = post.id;
  editPostForm["edit-title"].value = post.title;
  editPostForm["edit-content"].value = post.content;
  editPostForm["edit-author"].value = post.author;
  editPostForm["edit-image"].value = post.image || "";
}

// Update Post
editPostForm.addEventListener("submit", e => {
  e.preventDefault();

  const id = editPostForm["edit-id"].value;
  const updatedPost = {
    title: editPostForm["edit-title"].value,
    content: editPostForm["edit-content"].value,
    author: editPostForm["edit-author"].value,
    image: editPostForm["edit-image"].value
  };

  fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedPost)
  })
    .then(res => res.json())
    .then(() => {
      postList.innerHTML = "";
      fetch(BASE_URL)
        .then(res => res.json())
        .then(posts => posts.forEach(renderPostTitle));
      editPostForm.classList.add("hidden");
      postDetail.innerHTML = "";
    });
});

// Delete Post
function deletePost(id) {
  fetch(`${BASE_URL}/${id}`, { method: "DELETE" })
    .then(() => {
      postList.innerHTML = "";
      postDetail.innerHTML = "";
      fetch(BASE_URL)
        .then(res => res.json())
        .then(posts => posts.forEach(renderPostTitle));
    });
}

// Cancel Edit
cancelEditBtn.addEventListener("click", () => {
  editPostForm.classList.add("hidden");
  editPostForm.reset();
});
