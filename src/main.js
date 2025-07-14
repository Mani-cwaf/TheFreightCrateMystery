import './style.css'
import scenes from './scenes.json' assert { type: 'json' };

const container = document.body
const dialogBox = container.children[2]
const helper = document.querySelector(".helpers")

let currentScene = 0

let currentText = 0

let typing = false
const typeText = (text, choices) => {
  dialogBox.children[1].children[1].innerHTML = ""
  dialogBox.children[2].innerHTML = ""
  typing = true
  let index = 0
  let type = setInterval(() => {
    helper.style["opacity"] = 0
    if (index < text.length) {
      dialogBox.children[1].children[1].innerHTML += text[index];
      index += 1
    } else {
      clearInterval(type)
      typing = false;
      choices.forEach((choice) => {
        let button = document.createElement("button");
        button.innerHTML = choice.text
        button.onclick = () => {
          changeScene(choice.scene)
        }
        dialogBox.children[2].appendChild(button)
      });
      if (currentScene == 0 && currentText == 1) {
        helper.style["opacity"] = 1
      }
    }
  }, 30);
}

const CHARACTERS = {
  "Rubik": "The Engineer",
  "TikTok Sans": "The Conductor",
  "Comic Relief": "The Cargo Assistant"
}

const loadText = () => {
  const scene = scenes[currentScene]
  let choices = []
  if ((currentText < scene.dialog.length) && !typing) {
    const text = scene.dialog[currentText]
    if (currentText == scene.dialog.length - 1) {
      choices = text.choices
    }
    dialogBox.children[1].children[0].innerHTML = CHARACTERS[text.font]
    dialogBox.children[1].children[0].style["font-family"] = text.font
    typeText(text.font == "Rubik" ? text.line : `\"${text.line}\"`, choices)
    currentText++
  }
}

const loadScene = () => {
  const scene = scenes[currentScene]

  container.children[0].setAttribute("image", scene.background)


  const characters = [...container.children[1].children]
  characters.forEach(currentCharacter => {
    if (!scene.characters.includes(currentCharacter.name)) {
      currentCharacter.removeAttribute("visible")
      setTimeout(() => {
        container.children[1].removeChild(currentCharacter)
      }, 400);
    }
  });
  scene.characters.forEach(character => {
    let currentCharacters = [];
    characters.forEach((el) => {
      currentCharacters += el.name
    })
    if (!currentCharacters.includes(character)) {
      let div = document.createElement("div");
      div.setAttribute("image", character)
      if (character == "The Engineer") {
        div.classList.add("left")
      } else {
        div.classList.add("right")
      }
      div.name = character
      setTimeout(() => {
        div.setAttribute("visible", 'true')
      }, 100);
      container.children[1].appendChild(div)
    }
  });

  const text = scene.dialog[currentText]
  dialogBox.children[1].children[1].style["font-family"] = text.font
  dialogBox.children[1].children[1].innerHTML = ""
  dialogBox.children[2].innerHTML = ""
  setTimeout(() => {
    loadText()
  }, 800);
}

document.addEventListener("keydown", (e) => {
  if (e.key == " " || e.key == "Enter") {
    loadText()
  }
})

const changeScene = (id) => {
  currentScene = id
  currentText = 0
  loadScene()
}
changeScene(0)