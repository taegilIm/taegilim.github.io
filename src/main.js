// background toggle
const background = document.getElementById("background");
const blurBackground = document.getElementById("blur");
const toggle = document.getElementById("toggle");

toggle.addEventListener("click", () => {
  if (toggle.innerHTML === "On") {
    toggle.innerHTML = "Off";
    toggle.style.font;
    toggle.style.backgroundColor = "rgba(255, 50, 50, 1)";
    background.style.animation = "none";
    blurBackground.style.animation = "none";
  } else {
    toggle.innerHTML = "On";
    toggle.style.backgroundColor = "rgba(0, 255, 0, 0.5)";
    background.style.animation = "movebackground 300s linear infinite";
    blurBackground.style.animation = "moveblurimage 300s linear infinite";
  }
});

// scroll bar
const content = document.getElementById("projects");
const scrollBar = document.getElementById("scrollbar");
const thumb = document.getElementById("thumb");

function setThumbHeight() {
  const height = content.clientHeight / content.scrollHeight;
  thumb.style.height = height * 100 + "%";
}

function setScrollPosition() {
  const scrollRatio =
    content.scrollTop / (content.scrollHeight - content.clientHeight);
  thumb.style.top = scrollRatio * 12 + "%";
}

let time;
content.addEventListener("scroll", () => {
  thumb.classList.add("isScrolling");

  setThumbHeight();
  setScrollPosition();

  window.clearTimeout(time);
  time = setTimeout(() => {
    thumb.classList.remove("isScrolling");
  }, 1000);
});

// project information
function clickInfoButton(index) {
  let filePath;
  switch (index) {
    case 1:
      filePath = "/content/Create-Perspective-Transform-Image/project.html";
      break;

    default:
      break;
  }
  console.log(1);
  openHtmlContent(filePath, index + 2);
}

function openHtmlContent(filePath, index) {
  const req = new XMLHttpRequest();

  req.open("GET", filePath, true);
  req.onload = function () {
    console.log(2);
    if (req.status >= 200 && req.status < 300) {
      addContent(req.responseText, index);
    } else {
      console.error("error", req.status);
    }
  };
  req.send();
}

function addContent(html, index) {
  console.log(3);
  let div = document.createElement("div");
  div.innerHTML = html;

  const target = document.getElementById("projects");
  const position = document.querySelector(`#projects > :nth-child(${index})`);
  target.insertBefore(div, position);
}
