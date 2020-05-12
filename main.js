//return true renders, return false does not render
const allNumbers = [...Array(90).keys()].map(n => n + 1);

const randomInt = function(max) {
  return Math.floor((max + 1) * Math.random());
}

class BingoAdmin {
  constructor() {
    this.players = [];
    this.selectedNumbers = [];
    this.availableNumbers = [...allNumbers];
  }

  removeRandomAvailableNumber() {
    let index = randomInt(this.availableNumbers.length - 1);
    let number = this.availableNumbers[index];
    this.availableNumbers.splice(index, 1);
    this.selectedNumbers.push(number);
    return this.markPlayersCartones(number);
  }

  addPlayer(player) {
    this.players.push(player);
    //add validation by name and return false if player is already created
    return true;
  }

  getPlayerByName(name) {
    return this.players.find(player => player.name === name);
  }

  addCartonPlayerName(carton, playerName) {
    let player = this.getPlayerByName(playerName);
    if (player) {
      player.addCarton(carton);
      return true
    }
    return false;
  }

  markPlayersCartones(number) {
    let marked = false;
    this.players.forEach(player => {
      if (player.markCarton(number)) marked = true;
    });
    return marked;
  }

  getHtmlPlayersRender() {
    let htmls = this.players.map(player => {
      return player.getHtmlRender();
    });
    return `<div class="playerContainer">${htmls.join('</div><div class="playerContainer">')}</div>`
  }

  renderPlayers() {
    document.getElementById("players").innerHTML = this.getHtmlPlayersRender();
  }

  getHtmlNumbersRender() {

    let rows = [
      [...Array(9).keys()].map(n => n + 1),
      [...Array(10).keys()].map(n => n + 10),
      [...Array(10).keys()].map(n => n + 20),
      [...Array(10).keys()].map(n => n + 30),
      [...Array(10).keys()].map(n => n + 40),
      [...Array(10).keys()].map(n => n + 50),
      [...Array(10).keys()].map(n => n + 60),
      [...Array(10).keys()].map(n => n + 70),
      [...Array(10).keys()].map(n => n + 80),
      [90]
    ];

    let rowsHTML = "";
    rows.forEach(numbers => {
      rowsHTML += "<tr>"
      numbers.forEach(number => {
        let cssClass = ""
        if (this.selectedNumbers.includes(number)) cssClass = "selected"
        rowsHTML += `<td class="${cssClass}">${number}</td>`
      });
      rowsHTML += "</tr>";
    });


    let html = `<table>
        ${rowsHTML}
      </table>`
    return html;
  }

  renderNumbers() {
    document.getElementById("numbers").innerHTML = this.getHtmlNumbersRender();
  }
}

class Player {
  constructor(name) {
    this.name = name;
    this.cartones = [];
  }

  addCarton(carton) {
    this.cartones.push(carton);
    return true;
  }

  markCarton(number) {
    let marked = false;
    this.cartones.forEach(carton => {
      if (carton.mark(number)) marked = true;
    });
    return marked;
  }

  getHtmlRender() {
    let html = `<h3 class="playerName"><span>${this.name}</span></h3>`;
    html = `
      <div class="playerForm">
        ${html}
        <input type="text">
        <button onclick="bingoPage.addCartonPlayerName(event, '${this.name}')">Agregar carton</button>
      </div>`;
    let cartonesHtml = this.cartones.map(carton => {
      return carton.getHtmlRender()
    });
    html += `<div class="cartonsContainer">
        <div class="cartonContainer">
          ${cartonesHtml.join('</div><div class="cartonContainer">')}
        </div>
      </div>`;
    return html;
  }
}

class Carton {
  constructor(cartonNumber) {
    this.cartonNumber = cartonNumber;
    let numbers = window.cartones[cartonNumber];
    this.numbers = numbers.map(n => {
      return {
        value: n,
        marked: false
      }
    });
  }

  mark(number) {
    let found = this.numbers.find(n => n.value === number);
    if (!found) return false;
    found.marked = true;
    return true
  }

  getHtmlRender() {
    function getLineCells(numbers) {
      let html = "";
      numbers.forEach(numberObject => {
        let n = numberObject.value;
        let cssClass = "hasNumber"
        if (!n) {
          cssClass = "empty";
        }
        if (numberObject.marked) cssClass += " marked";
        html += `<td class="${cssClass}">${n || ""}</td>`
      });
      return html;
    }

    let line1 = this.numbers.slice(0, 9);
    let line2 = this.numbers.slice(9, 18);
    let line3 = this.numbers.slice(18, 27);

    let htmlCarton = `<h4 class="cartonNumber">${this.cartonNumber}:</h4><table><tbody>
    <tr>${getLineCells(line1)}</tr>
    <tr>${getLineCells(line2)}</tr>
    <tr>${getLineCells(line3)}</tr>
    </tbody>
    </table>`

    return htmlCarton;
  }
}

class BingoPage {
  //this needs a bingoAdmin to work
  constructor(bingoAdmin) {
    this.bingoAdmin = bingoAdmin;
  }

  addPlayer() {
    let name = document.getElementById("addPlayerInput").value;
    let player = new Player(name);
    if (this.bingoAdmin.addPlayer(player)) {
      this.bingoAdmin.renderPlayers();
    } else {
      //some error?
    }
    return player;
  }

  //TODO remove testing function
  getPlayerByName(name) {
    return this.bingoAdmin.getPlayerByName(name);
  }

  //TODO remove testing function
  markCarton(number) {
    this.bingoAdmin.markPlayersCartones(number);
    this.bingoAdmin.renderPlayers();
    this.bingoAdmin.selectedNumbers.push(number);
    this.bingoAdmin.renderNumbers();
  }

  getRandomNumber() {
    if(this.bingoAdmin.removeRandomAvailableNumber()) this.bingoAdmin.renderPlayers();
    this.bingoAdmin.renderNumbers();
  }

  addCartonPlayerName(event, playerName) {
    let carton = new Carton(event.target.parentElement.children[1].value);
    if (this.bingoAdmin.addCartonPlayerName(carton, playerName)) {
      this.bingoAdmin.renderPlayers();
    } else {
      //error?
    }
  }

  addCartonToPlayer(player) {

  }
}

window.bingoPage = new BingoPage(new BingoAdmin());
