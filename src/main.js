// background canvas
const canvas = document.getElementById("background-canvas");
const context = canvas.getContext("2d");

const image = new Image();
image.src = "/src/image/background.jpg";
let animationId;

const speed = 0.5;
const blurImage = document.getElementById("background-blur");

let widthScale;
let heightScale;
let pos = [0, 0];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const aspectRatio = image.width / image.height;
  if (canvas.width / canvas.height > aspectRatio) {
    widthScale = canvas.width;
    heightScale = canvas.width / aspectRatio;
  } else {
    widthScale = canvas.height * aspectRatio;
    heightScale = canvas.height;
  }
}

function blurEffect() {
  const blurSize = blurImage.getBoundingClientRect();

  context.save();
  context.filter = "blur(20px)";
  context.drawImage(
    canvas,
    blurSize.x,
    blurSize.y,
    blurSize.width,
    blurSize.height,
    blurSize.x,
    blurSize.y,
    blurSize.width,
    blurSize.height
  );
  context.restore();
}

function update() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let x = pos[0]; x > -widthScale; x -= widthScale) {
    for (let y = pos[1]; y < heightScale; y += heightScale) {
      context.drawImage(image, x, y, widthScale, heightScale);
    }
  }

  blurEffect();

  pos[0] += speed;
  pos[1] -= speed;

  if (pos[0] >= widthScale) {
    pos[0] = 0;
  }
  if (pos[1] <= -heightScale) {
    pos[1] = 0;
  }

  animationId = requestAnimationFrame(update);
}

image.onload = function () {
  resizeCanvas();
  update();
};

window.addEventListener("resize", resizeCanvas);

// background toggle
const toggle = document.getElementById("toggle-button");

toggle.addEventListener("click", () => {
  if (toggle.innerHTML === "On") {
    cancelAnimationFrame(animationId);
    toggle.innerHTML = "Off";
    toggle.style.backgroundColor = "rgba(255, 50, 50, 1)";
  } else {
    animationId = requestAnimationFrame(update);
    toggle.innerHTML = "On";
    toggle.style.backgroundColor = "rgba(0, 255, 0, 0.5)";
  }
});

// scroll bar
const content = document.getElementById("main-projects");
const scrollBar = document.getElementById("project-scrollbar");
const thumb = document.getElementById("project-scrollbar-thumb");

function setThumbHeight() {
  const height = content.clientHeight / content.scrollHeight;
  thumb.style.height = height * 100 + "%";
}

function setScrollPosition() {
  const scrollRatio =
    content.scrollTop / (content.scrollHeight - content.clientHeight);
  thumb.style.top = scrollRatio * 50 + "%";
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

// information button events
const infoButton = document.getElementsByClassName("sub-info");

Array.from(infoButton).forEach((element) => {
  element.addEventListener("mouseenter", () => {
    element.style.backgroundColor = "rgba(230, 230, 230, 0.3)";
  });
  element.addEventListener("mouseleave", () => {
    element.style.backgroundColor = "rgba(0, 0, 0, 0)";
  });
});

// project information
let isClicked = [false, false, false];
let elementCount = [0, 0, 0];

function clickInfoButton(index) {
  let filePath;
  switch (index) {
    case 1:
      filePath = "/content/Create-Perspective-Transform-Image/project.html";
      break;

    default:
      filePath = "/content/Create-Perspective-Transform-Image/project.html";
      break;
  }
  let position = elementCount
    .slice(0, index - 2)
    .reduce((result, current) => result + current, 0);
  position += index;

  if (isClicked[index - 3] === false) {
    elementCount[index - 3] = 1;
    isClicked[index - 3] = true;
    openHtmlContent(filePath, position);
  } else {
    elementCount[index - 3] = 0;
    isClicked[index - 3] = false;
    removeContent(position);
  }
}

function openHtmlContent(filePath, index) {
  const req = new XMLHttpRequest();
  const timestamp = new Date().getTime();
  const url = `${filePath}?v=${timestamp}`;

  req.open("GET", url);
  req.onload = function () {
    if (req.status >= 200 && req.status < 300) {
      addContent(req.responseText, index);
    } else {
      console.error("error", req.status);
    }
  };
  req.send();
}

function addContent(html, index) {
  let div = document.createElement("div");
  div.className = "project";
  div.innerHTML = html;

  const target = document.getElementById("main-projects");
  const position = document.querySelector(
    `#main-projects > :nth-child(${index})`
  );
  target.insertBefore(div, position);
}

function removeContent(index) {
  const target = document.querySelector(
    `#main-projects > :nth-child(${index - 1})`
  );
  target.remove();
}
