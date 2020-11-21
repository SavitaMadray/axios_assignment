document.addEventListener("DOMContentLoaded", async () => {
  await createNewDeck();
  drawCardBtn();
});

let deckID;
let arr = [];
let resetGame = false;

const drawCardBtn = () => {
  let drawCardsBtn = document.querySelector("#drawCard");
  drawCardsBtn.addEventListener("click", () => {
    drawCards();
    gameReset();
  });
};

const createNewDeck = async () => {
  try {
    let response = await axios.get(
      "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
    );
    deckID = response.data.deck_id;
  } catch (err) {
    console.log(err);
  }
};

const drawCards = async () => {
  let prevDiv = document.querySelector("#cardDiv");
  let firstEx = document.querySelector("#firstEx");
  if (prevDiv) {
    firstEx.removeChild(prevDiv);
  }
  let selectCards = document.querySelector("#selectCards");
  let selectCardsVal = selectCards.value;
  let url = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${selectCardsVal}`;
  try {
    let response = await axios.get(url);
    let cards = response.data.cards;
    displayCards(cards);
    scoreCards(cards);
  } catch (err) {
    console.log(err);
  }
};

const drawSingleCard = async () => {
  let url = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`;
  try {
    let response = await axios.get(url);
    let singleCard = response.data.cards;
    displayCards(singleCard);
    scoreCards(singleCard);
  } catch (err) {
    console.log(err);
  }
};

const displayCards = (cards) => {
  let cardDiv = document.createElement("div");
  cardDiv.id = "cardDiv";
  firstEx.appendChild(cardDiv);
  for (let card of cards) {
    let cardImg = document.createElement("img");
    cardImg.id = "cardImg";
    cardImg.src = card.image;
    cardDiv.appendChild(cardImg);
  }
};

const scoreCards = (cards) => {
  let result = document.querySelector("#result");
  let prevPara = document.querySelector("#resultPara");
  if (prevPara) {
    result.removeChild(prevPara);
  }
  let resultPara = document.createElement("p");
  resultPara.id = "resultPara";
  result.appendChild(resultPara);

  for (let card of cards) {
    arr.push(card.value);
  }
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === "ACE") {
      arr[i] = 11;
    }
    if (arr[i] === "KING" || arr[i] === "QUEEN" || arr[i] === "JACK") {
      arr[i] = 10;
    }
  }
  showResult(arr);
};

const showResult = (arr) => {
  let sum = arr.reduce((acc, el) => {
    let add = parseInt(acc) + parseInt(el);
    return add;
  });
  if (sum < 21) {
    resultPara.innerText = `Player 1 Score: ${sum}`;
    let hitBtn = document.createElement("button");
    hitBtn.id = "hitBtn";
    hitBtn.innerText = "Hit";
    let stayBtn = document.createElement("button");
    stayBtn.id = "stay";
    stayBtn.innerText = "Stay";
    hitBtn.addEventListener("click", () => {
      drawSingleCard();
    });
    stayBtn.addEventListener("click", () => {
      stay();
    });
    resultPara.appendChild(hitBtn);
    resultPara.appendChild(stayBtn);
  } else if (sum > 21) {
    let indx = arr.indexOf(11);
    if (indx > -1) {
      arr[indx] = 1;
      showResult(arr);
      return;
    }
    resultPara.innerText = `Bust. Player 1 Score: ${sum}`;
  } else if (sum === 21) {
    resultPara.innerText = `BLACKJACK. You win!!`;
  }
};

const stay = async () => {
  let url = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=3`;
  try {
    let response = await axios.get(url);
    let threeCards = response.data.cards;
    displayCards(threeCards);
    scoreStayCards(threeCards);
  } catch (err) {
    console.log(err);
  }
};

const scoreStayCards = (cards) => {
  let result = document.querySelector("#result");
  let prevSumPara = document.querySelector("#sumPara");
  if (prevSumPara) {
    result.removeChild(prevSumPara);
  }
  let sumPara = document.createElement("p");
  sumPara.id = "sumPara";
  result.appendChild(sumPara);
  let stayarr = [];
  for (let card of cards) {
    stayarr.push(card.value);
  }
  for (let i = 0; i < stayarr.length; i++) {
    if (stayarr[i] === "ACE") {
      stayarr[i] = 11;
    }
    if (
      stayarr[i] === "KING" ||
      stayarr[i] === "QUEEN" ||
      stayarr[i] === "JACK"
    ) {
      stayarr[i] = 10;
    }
  }
  displayFinal(stayarr);
};

const displayFinal = (stayarr) => {
  let sums = stayarr.reduce((acc, el) => {
    let adds = parseInt(acc) + parseInt(el);
    return adds;
  });
  if (sums < 21) {
    sumPara.innerText = `Opponent Score: ${sums}`;
  } else if (sums > 21) {
    sumPara.innerText = `BUST!! Opponent Score: ${sums}`;
  } else if (sums === 21) {
    sumPara.innerText = `BLACKJACK. You win!!`;
  }
  resetGame = true;
};

const gameReset = () => {
  if (resetGame === true) {
    let main = document.querySelector("#firstEx");
    let result = document.querySelector("#result");
    main.innerHTML = "";
    result.innerHTML = "";
  }
};
