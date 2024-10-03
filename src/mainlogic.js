
setupUI();
getCurrentUser();
function setupUI() {
  let token = localStorage.getItem("token");
  let login = document.querySelector(".login");
  let register = document.querySelector(".register");
  let btncreate = document.querySelector(".create-btn");
  if (token == null) {
    login.style.display = "block";
    register.style.display = "block";
    btncreate.style.display = "none";
    document.querySelector(".logout").style.display = "none";
  } else {
    login.style.display = "none";
    register.style.display = "none";
    btncreate.style.display = "block";
    document.querySelector(".logout").style.display = "flex";
    let user = getCurrentUser();
    console.log(user);
    document.querySelector(".nav-username").innerHTML = user.username;
    document.querySelector(".profile-img").src = user.profile_image;
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  document.querySelector(".logout").style.display = "none";
  document.querySelector(".login").style.display = "block";
  document.querySelector(".register").style.display = "block";
  document.querySelector(".success-logout").style.display = "block";
  document.querySelector(".create-btn").style.display = "none";
  setTimeout(() => {
    document.querySelector(".success-logout").style.display = "none";
  }, 1000);
}

document.querySelector(".login-close-modal").addEventListener("click", () => {
  document.querySelector(".modal-login").style.visibility = "hidden";
});
document.querySelector(".register").addEventListener("click", () => {
  document.querySelector(".modal-register").style.visibility = "visible";
});
document.querySelector(".register-close").addEventListener("click", () => {
  document.querySelector(".modal-register").style.visibility = "hidden";
});

function getCurrentUser() {
  let user = null;
  let storageUser = localStorage.getItem("user");
  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }
  console.log(user);
  return user;
}
let login1 = document.querySelector(".login");
login1.addEventListener("click", function () {
  document.querySelector(".modal-login").style.visibility = "visible";
});
document.querySelector(".login-modal-btn").addEventListener("click", function () {
    let username = document.querySelector(".username-login").value;
    let password = document.querySelector(".password-login").value;
    const params = {
      username: username,
      password: password,
    };
    loading(true);
    axios.post("https://tarmeezacademy.com/api/v1/login", params)
      .then((response) => {
        let token = response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        let classList = document.getElementById("modal-login").classList;
        document.querySelector(".modal-login").style.display = "none";
        classList.toggle("hidden");
        classList.toggle("block");
      })
      .then(() => {
        document.querySelector(".register").style.display = "none";
        document.querySelector(".login").style.display = "none";
        document.querySelector(".logout").style.display = "flex";
        document.querySelector(".success-login").style.display = "block";
        document.querySelector(".create-btn").style.display = "block";
        setTimeout(() => {
          document.querySelector(".success-login").style.display = "none";
        }, 1000);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        loading(false);
      });;
  })

function registerClicked() {
  let name = document.querySelector(".register-name").value;
  let username = document.querySelector(".register-username").value;
  let password = document.querySelector(".register-password").value;
  let btncreate = document.querySelector(".create-btn");
  let image = document.querySelector(".register-image").files[0];
  let formData = new FormData();
  formData.append("name", name);
  formData.append("username", username);
  formData.append("password", password);
  formData.append("image", image);
  let headers = {
    "Content-Type": "multipart/form-data",
  };
  loading(true);
  axios.post("https://tarmeezacademy.com/api/v1/register", formData, {
      headers: headers,
    })
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setupUI();
      document.querySelector(".success-register").style.display = "block";
      document.querySelector(".create-btn").style.display = "block";
      setTimeout(() => {
        document.querySelector(".success-register").style.display = "none";
      }, 1000);
    })
    .catch((error) => {
      console.log(error);
      let msg = error.response.data.message;
      let content = `
        <p class="text-lg text-gray-800">${msg}</p>
            `;
      document.querySelector(".failed-register").innerHTML = content;
      document.querySelector(".failed-register").style.display = "block";
      setTimeout(() => {
        document.querySelector(".failed-register").style.display = "none";
      }, 2000);
    })
    .finally(() => {
      document.querySelector(".modal-register").style.visibility = "hidden";
      loading(false);
    });
}

function editPost(postString) {
  document.querySelector(".modal-edit-post").style.visibility = "visible";
  let post = JSON.parse(decodeURIComponent(postString));
  console.log(post);
  let bodyValue = post.body;
  let titleValue = post.title;
  document.querySelector(".edit-title").value = titleValue;
  document.querySelector(".edit-body").innerHTML = bodyValue;
  document.querySelector(".close-edit").addEventListener("click", () => {
    document.querySelector(".modal-edit-post").style.visibility = "hidden";
  });
  document.querySelector(".edit-post").addEventListener("click", () => {
    loading(true);
    let title = document.querySelector(".edit-title").value;
    let body = document.querySelector(".edit-body").value;
    let image = document.querySelector(".edit-image").files[0];
    let token = localStorage.getItem("token");
    let formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("image", image);
    formData.append("_method", "put");
    let headers = {
      "Content-Type": "multipart/form-data",
      authorization: `Bearer ${token}`,
    };
    axios.post(`https://tarmeezacademy.com/api/v1/posts/${post.id}`, formData, {
        headers: headers,
      })
      .then((response) => {
        getPosts();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        document.querySelector(".modal-edit-post").style.visibility = "hidden";
        loading(false);
      });
  });
}
function deletePost(postId) {
  document.querySelector(".modal-delete-post").style.visibility = "visible";
  document.querySelector(".close-delete").addEventListener("click", () => {
    document.querySelector(".modal-delete-post").style.visibility = "hidden";
  });
  document.querySelector(".delete-post").addEventListener("click", () => {
    let token = localStorage.getItem("token");
    let headers = {
      authorization: `Bearer ${token}`,
    };
    loading(true);
    axios
      .delete(`https://tarmeezacademy.com/api/v1/posts/${postId}`, {
        headers: headers,
      })
      .then((response) => {
        console.log(response);
        document.querySelector(".modal-delete-post").style.visibility =
          "hidden";
        getPosts();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        loading(false);
      });
  });
}

function createPost() {
  let title = document.querySelector(".title-post").value;
  let body = document.querySelector(".body-post").value;
  let image = document.querySelector(".image-post").files[0];
  let token = localStorage.getItem("token");
  let formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("image", image);
  let headers = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };
  loading(true);
  axios
    .post("https://tarmeezacademy.com/api/v1/posts", formData, {
      headers: headers,
    })
    .then((response) => {
      document.querySelector(".success-create").style.display = "block";
      setTimeout(() => {
        document.querySelector(".success-create").style.display = "none";
      }, 1000);
      getPosts();
    })
    .catch((error) => {
      const msg = error.response.data.message;
      let content = `<p class="text-lg text-gray-800">${msg}</p>`;
      document.querySelector(".failed-create").innerHTML = content;
      document.querySelector(".failed-create").style.display = "block";
      setTimeout(() => {
        document.querySelector(".failed-create").style.display = "none";
      }, 2000);
      getPosts();
    })
    .finally(() => {
      document.querySelector(".modal-create-post").style.visibility = "hidden";
      loading(false);
    });
}

function loading(show = true) {
  if(show) {
    document.querySelector(".loading").style.visibility = "visible";
  }
  else {
    document.querySelector(".loading").style.visibility = "hidden";
  }
}
document.querySelector(".create-btn").addEventListener("click", () => {
  document.querySelector(".modal-create-post").style.visibility = "visible";
});
document.querySelector(".close-post").addEventListener("click", () => {
  document.querySelector(".modal-create-post").style.visibility = "hidden";
});

function getProfile(authorId) {
  window.location = `profile.html?author=${authorId}`;
}

function profileClicked() {
  let user = getCurrentUser();
  window.location = `profile.html?author=${user.id}`;
}