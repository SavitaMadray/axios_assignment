document.addEventListener("DOMContentLoaded", async () => {
  await createNewDeck();
  drawCardBtn();
});
let deckID;
let arr = [];

const drawCardBtn = () => {
  let drawCardsBtn = document.querySelector("#drawCard");
  drawCardsBtn.addEventListener("click", () => {
    drawCards();
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

const reshuffleDeck = async () => {
  let url = `https://deckofcardsapi.com/api/deck/${deckID}/shuffle/`;
  try {
    let response = await axios.get(url);
  } catch (err) {
    console.log(err);
  }
};

const scoreCards = (cards) => {
  let result = document.querySelector("#result");
  let prevPara = document.querySelector("#resultPara");
  let prevSumPara = document.querySelector("#sumPara");
  if (prevPara) {
    result.removeChild(prevPara);
    result.removeChild(prevSumPara);
  }
  let sumPara = document.createElement("p");
  sumPara.id = "sumPara";
  let resultPara = document.createElement("p");
  resultPara.id = "resultPara";
  result.appendChild(resultPara);
  result.appendChild(sumPara);

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
    showResult(arr);
  }
};

const showResult = (arr) => {
  let sum = arr.reduce((acc, el) => {
    let add = parseInt(acc) + parseInt(el);
    return add;
  });
  console.log(sum);
  if (sum < 21) {
    resultPara.innerText = `Not 21`;
    sumPara.innerText = `Sum = ${sum}`;
    let hitBtn = document.createElement("button");
    hitBtn.id = "hitBtn";
    hitBtn.innerText = "Hit";
    hitBtn.addEventListener("click", () => {
      drawSingleCard();
    });
    resultPara.appendChild(hitBtn);
  } else if (sum > 21) {
    resultPara.innerText = "Bust";
    sumPara.innerText = `Sum = ${sum}`;
  } else if (sum === 21) {
    resultPara.innerText = "BLACKJACK";
    sumPara.innerText = `Sum = ${sum}`;
  }
};
