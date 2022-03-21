window.addEventListener('DOMContentLoaded', ()=> {

  let intervalId;
  function GAME(num) {

    document.documentElement.style.setProperty('--height-cards', num)

    mainStorage = document.createElement('section');
    mainStorage.classList.add('memoryGame')

    listStorage = document.createElement('ul');
    listStorage.classList.add('memoryGame__list')

    let hasFlippedCard = false;
    let firstCard, secondCard;
    let lockBoard = false;


    numberList = []

    for (let i=0; i<Math.pow(num, 2); i++) {
      numberList.push(Math.floor(i/2))
    }

    function shuffle(array) {
      for (let i = array.length-1; i>0; i--) {


        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    shuffle(numberList);


    for (let i of numberList) {
      cardGame = document.createElement('li');
      cardGame.classList.add('memoryGame__card', 'card')
      cardGame.setAttribute('data-id', i)

      backImg = document.createElement('img');
      backImg.classList.add('card__back')
      backImg.src = 'imgs/logo-back.svg'

      frontImg = document.createElement('img');
      frontImg.classList.add('card__front')
      frontImg.src = `imgs/cards/${i}.png`

      cardGame.append(frontImg,backImg)
      listStorage.append(cardGame)

      cardGame.addEventListener('click',  flipCard)
    }
    function flipCard(elem) {

      if (lockBoard) return;
      if (elem.currentTarget === firstCard) return;
      elem.currentTarget.classList.add('card__flip');

      if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard =  elem.currentTarget;
        return;
      }
      secondCard = elem.currentTarget;
      checkForMatch(firstCard, secondCard, flipCard);
    }



    function checkForMatch(elem1, elem2, func) {
      let id1, id2;
      id1 = elem1.getAttribute('data-id');
      id2 = elem2.getAttribute('data-id');
      if (id1===id2) {
        disableCards(elem1, elem2, func);
        return;
      }
      unflipCards(elem1, elem2)
    }

    function disableCards(elem1, elem2,func) {
      elem1.removeEventListener('click', func);
      elem2.removeEventListener('click', func);
      resetBoard(elem1, elem2);
    };
    function unflipCards(elem1, elem2) {
      lockBoard = true;
      setTimeout(() => {
        elem1.classList.remove('card__flip');
        elem2.classList.remove('card__flip');
        resetBoard(elem1, elem2);
      }, 1500);
    }

    function resetBoard() {
      [hasFlippedCard, lockBoard] = [false, false];
      [firstCard, secondCard] = [null, null];
    }



    mainStorage.append(listStorage)
    return [mainStorage, listStorage];
  }


  const container = document.querySelector('.container')


  function mainMenu() {
    let endRemove = document.querySelector('.endDiv');
    let timerRemove = document.querySelector('.Game__timer');
    let gameRemove = document.querySelector('.memoryGame');
    if (endRemove) {
      endRemove.remove();
      timerRemove.remove();
      gameRemove.remove()
    }
    const heading = document.createElement('img')
    heading.src = 'imgs/logo.png'
    heading.alt = 'Memory Game'
    heading.classList.add('startGame__heading')

    const inputDiv = document.createElement('div')
    inputDiv.classList.add('startGame__btns')
    const currInput = document.createElement('input')
    currInput.classList.add('startGame__input')
    currInput.type = 'number'
    currInput.placeholder = 'Кол-во карточек по вертикали/горизонтали'
    currInput.pattern = "[0-9]*"
    const currButton = document.createElement('button')
    currButton.textContent = 'Начать игру'
    currButton.classList.add('startGame__btn')
    inputDiv.append(currInput,currButton);
    container.append(heading,inputDiv);
    currButton.addEventListener('click', startGame.bind(null,currInput,inputDiv,heading))
  }

  function startGame(elemInp, inpDiv,heading) {
    let currValue = +elemInp.value
    if (currValue>=2 && currValue<=10 && currValue % 2===0) {
      //pass
    }
    else {
      currValue = 4
    }

    [currGame,listStorage] = GAME(currValue)
    const currTimer = document.createElement('div')
    currTimer.classList.add('Game__timer')
    currTimer.textContent = 60;
    container.append(currTimer,currGame)
    inpDiv.remove()
    heading.remove()
    intervalId = setInterval(timer, 100,currTimer, listStorage);
  }


  function endGame() {
    const endDivCont = document.createElement('div')
    endDivCont.classList.add('endDiv')
    const endDiv = document.createElement('button')
    endDiv.textContent = 'Сыграть еще раз'
    endDiv.classList.add('startGame__btn', 'endGame')
    endDivCont.append(endDiv)
    document.body.append(endDivCont)
    endDiv.addEventListener('click', mainMenu)
  }

  function timer(elem, listStorage) {
    elem.textContent =  Math.round((+elem.textContent - 0.1)*10)/10;
    if (+elem.textContent === 0 || compareCards(listStorage, '.card__flip')) {
      clearInterval(intervalId);
      endGame();
    }
  }

  function compareCards(elems, someClass) {
    let first = document.querySelectorAll(someClass);
    return first.length===elems.children.length;
  }

  mainMenu();

})

