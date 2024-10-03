getCurrentUser();
getPosts();
let currentPage = 1;
let lastPage = 1;
window.addEventListener("scroll", () => {
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
  if (endOfPage && currentPage < lastPage) {
    currentPage = currentPage + 1;
    getPosts(false, currentPage);
  }
});

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
    document.querySelector(".nav-username").innerHTML = user.username;
    document.querySelector(".profile-img").src = user.profile_image;
  }
}
function getCurrentUser() {
  let user = null;
  let storageUser = localStorage.getItem("user");
  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }
  return user;
}
let login = document.querySelector(".login");
login.addEventListener("click", function () {
  document.querySelector(".modal-login").style.visibility = "visible";
});
document.querySelector(".create-btn").addEventListener("click", () => {
  document.querySelector(".modal-create-post").style.visibility = "visible";
});
document.querySelector(".close-post").addEventListener("click", () => {
  document.querySelector(".modal-create-post").style.visibility = "hidden";
});
function getPosts(reload = true,page = 1) {
  loading(true);
  axios
    .get(`https://tarmeezacademy.com/api/v1/posts?limit=10&page=${page}`)
    .then((response) => {
      lastPage = response.data.meta.last_page;
      const posts = response.data.data;
      if(reload) {
        document.getElementById("post").innerHTML = "";
      }
      for (let post of posts) {
        let user = getCurrentUser();
        let isMyPost = user != null && user.id == post.author.id;
        let btn = ``;
        if (isMyPost) {
          btn = `
          <div class="ml-auto flex">
            <button id="edit-btn"  class="bg-black p-2 rounded-md text-white ml-auto text-sm font-semibold shadow-sm sm:ml-3 sm:w-auto" onclick="editPost('${encodeURIComponent(
              JSON.stringify(post)
            )}')">Edit</button>
            <button class="delete-post  flex justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto" onclick="deletePost(${
              post.id
            })">Delete</button>
          </div>
          `;
        }
        let content = `
          <div class="p-5 " id="post">
            <div class="flex p-1 cursor-pointer">
                <span class="flex" onclick="getProfile('${post.author.id}')">
                  <img src="${post.author.profile_image}" alt="" class="w-10 h-10 rounded-full">
                  <span class="mt-1 ml-2">${post.author.username}</span>
                </span>
                ${btn}
              </div>
            <hr>
            <div class="my-2 p-1 hover:cursor-pointer" onclick="postClicked(${post.id})">
                <img  src="${post.image}" alt="" class="w-full p-5">
                <p class="text-gray-500">${post.created_at}</p>
                <h1 class="font-bold text-lg">${post.title}</h1>
                <p>${post.body}</p>
            </div>
            <hr>
            <div>
                <span>(${post.comments_count}) comments</span>
            </div>`;
        document.getElementById("post").innerHTML += content;
      }
    })
    .catch(function (error) {
      console.log(error);
    }).finally(()=>{
        loading(false);
    });
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
let register = document.querySelector(".register");
login.addEventListener("click", function () {
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
    axios
      .post("https://tarmeezacademy.com/api/v1/login", params)
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
  });

document.querySelector(".create-btn").addEventListener("click", () => {
  document.querySelector(".modal-create-post").style.visibility = "visible";
});
document.querySelector(".close-post").addEventListener("click", () => {
  document.querySelector(".modal-create-post").style.visibility = "hidden";
});
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
  axios.post("https://tarmeezacademy.com/api/v1/posts", formData, {
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

function postClicked(postId) {
  window.location=`showPost.html?postId=${postId}`;
};
function getProfile(authorId) {
  window.location = `profile.html?author=${authorId}`;
};

function profileClicked() {
  let user = getCurrentUser();
  window.location = `profile.html?author=${user.id}`;
}
function loading(show = true) {
  if (show) {
    document.querySelector(".loading").style.visibility = "visible";
  } else {
    document.querySelector(".loading").style.visibility = "hidden";
  }
}