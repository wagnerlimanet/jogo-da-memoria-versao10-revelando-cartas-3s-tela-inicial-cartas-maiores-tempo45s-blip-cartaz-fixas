const somAcerto = new Audio('sons/acerto.mp3');
const somErro = new Audio('sons/erro.mp3');

const cards = document.querySelectorAll('.cartao-de-memoria');
const restartButton = document.getElementById('restart-button');
const overlay = document.getElementById('game-over-overlay');
const gameMessage = document.getElementById('game-message');
const timerElement = document.getElementById('timer');

let hasFlippedCard = false;
let lockBoard = true;
let firstCard, secondCard;
let matchedPairs = 0;
const totalPairs = cards.length / 2;

let timeLeft = 45;
let timer;

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `⏱️ ${timeLeft}s`;
    if (timeLeft === 0) {
      clearInterval(timer);
      endGame(false);
    }
  }, 1000);
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard || this.classList.contains('matched')) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  if (isMatch) {
    disableCards();
    matchedPairs++;
    if (matchedPairs === totalPairs) {
      clearInterval(timer);
      endGame(true);
    }
  } else {
    unflipCards();
  }

  if (isMatch) {
    somAcerto.play();
    disableCards();
    matchedPairs++;
    if (matchedPairs === totalPairs) {
      clearInterval(timer);
      endGame(true);
    }
  } else {
    somErro.play();
    unflipCards();
  }
}

function disableCards() {
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1200);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function endGame(won) {
  overlay.classList.remove('hidden');
  gameMessage.textContent = won
    ? "Parabéns, você ganhou!"
    : "Ah, que pena; não foi dessa vez.";

  if (won) {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
    });
  }
}

function shuffleCards() {
  let cardArray = Array.from(cards);
  cardArray.sort(() => Math.random() - 0.5);
  cardArray.forEach((card, index) => {
    card.style.order = index;
  });
}

function restartGame() {
  matchedPairs = 0;
  timeLeft = 30;
  timerElement.textContent = `⏱️ 30s`;
  clearInterval(timer);
  shuffleCards();
  overlay.classList.add('hidden');
  cards.forEach(card => {
    card.classList.remove('flip', 'matched');
    card.addEventListener('click', flipCard);
  });
  resetBoard();
  setTimeout(() => {
    cards.forEach(card => card.classList.add('flip'));
    setTimeout(() => {
      cards.forEach(card => card.classList.remove('flip'));
      lockBoard = false;
      startTimer();
    }, 2000);
  }, 100);
}

cards.forEach(card => card.addEventListener('click', flipCard));

// Exibir cartas no início do jogo
shuffleCards();
cards.forEach(card => card.classList.add('flip'));
setTimeout(() => {
  cards.forEach(card => card.classList.remove('flip'));
  lockBoard = false;
  startTimer();
}, 3000);

restartButton.addEventListener('click', restartGame);
