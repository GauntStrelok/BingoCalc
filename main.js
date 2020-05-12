//return true renders, return false does not render

class BingoAdmin {
  constructor() {
    this.players = [];
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
    if(player) {
      player.addCarton(carton);
      return true
    }
    return false;
  }

  getHtmlRender() {
    let htmls = this.players.map(player => {
      return player.getHtmlRender();
    });
    return `<div class="playerContainer">${htmls.join('</div><div class="playerContainer">')}</div>`
  }

  render() {
    document.getElementById("players").innerHTML = this.getHtmlRender();
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
      if(carton.mark(number)) marked = true;
    });
    return marked;
  }

  getHtmlRender() {
    let html = `<h3 class="playerName"><span>${this.name}</span></h3>`;
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
    let found = numbers.find(n => n.value === number);
    if(!found) return false;
    found.marked = true;
    return true
  }

  getHtmlRender() {
    function getLineCells(numbers) {
      let html = "";
      numbers.forEach(numberObject => {
        let n = numberObject.value;
        let cssClass = "hasNumber"
        if(!n) {
          cssClass = "empty";
        }
        if(numberObject.marked) cssClass += " marked";
        html += `<td class="${cssClass}">${n || ""}</td>`
      });
      return html;
    }

    let line1 = this.numbers.slice(0,9);
    let line2 = this.numbers.slice(9,18);
    let line3 = this.numbers.slice(18,27);

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

  addPlayer(name) {
    let player = new Player(name);
    if(this.bingoAdmin.addPlayer(player)) {
      this.bingoAdmin.render();
    } else {
      //some error?
    }
    return player;
  }

  //TODO remove testing function
  getPlayerByName(name) {
    return this.bingoAdmin.getPlayerByName(name);
  }

  addCartonPlayerName(carton, playerName) {
    if(this.bingoAdmin.addCartonPlayerName(carton, playerName)) {
      this.bingoAdmin.render();
    } else {
      //error?
    }
  }
}

window.bingoPage = new BingoPage(new BingoAdmin());
