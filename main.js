//return true renders, return false does not render

class BingoAdmin {
  constructor() {
    this.players = [];
  }

  addPlayer(player) {
    this.players.push(player);
    return true;
  }

  getHtmlRender() {
    let htmls = this.players.map(player => {
      player.getHtmlRender();
    });
    return `<div>${htmls.join('</div><div>')}</div>`
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
    let html = `<div style="width:20%"><span>${this.name}</span></div>`;
    let cartonesHtml = this.cartones.map(carton => {
      return carton.getHtmlRender()
    });
    html += `<div style="width:20%">${cartonesHtml.join('</div><div style="width:20%">')}</div>`
    return html;
  }
}

class Carton {
  constructor(numbers) {
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
    return `<div><span>${numbers.join('-')}</span></div>`
  }
}

class BingoPage {
  //this needs a bingoAdmin to work
  constructor(bingoAdmin) {
    this.bingoAdmin = bingoAdmin;
  }

  addPlayer(name) {
    let player = new Player(name);
    this.bingoAdmin.addPlayer();
  }
}

window.bingoAdmin = new BingoAdmin();

window.bingoPage = new BingoPage(window.bingoAdmin);
