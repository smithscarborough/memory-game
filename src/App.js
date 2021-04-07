import React from 'react';
import './App.css';
import Card from './components/Card'

const deck = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']

const generateDeck = () => {
  const symbols = ['∆', 'ß', '£', '§', '•', '$', '+', 'ø'];
  const emptyDeck = [];
  deck.forEach((slot, index)=>{
    emptyDeck.push({isFlipped: false, symbol: symbols[index%8]})
  })

  //Shuffle logic
  for(let outIndex = emptyDeck.length - 1; outIndex >= 0; outIndex--){
    let randomIndex = Math.floor(Math.random() * outIndex); 
    [emptyDeck[outIndex], emptyDeck[randomIndex]] = [emptyDeck[randomIndex], emptyDeck[outIndex]];
  }

  return emptyDeck;
}

class App extends React.Component{

  constructor(props){
      super(props);

      this.state = {
        deck: generateDeck(),
        pickedCards: [],
        displayButton: false,
        matchedCards: 0
      };
  }

  resetGame = () => {
    this.setState({
      deck: generateDeck(),
      pickedCards: [],
      displayButton: false,
      matchedCards: 0
    })
  }

  unflipCards = (card1Index, card2Index) => {
    const [card1, card2] = [{...this.state.deck[card1Index]}, {...this.state.deck[card2Index]}]
    card1.isFlipped = false;
    card2.isFlipped = false;
    const newDeck = this.state.deck.map((card, index)=>{
      if(card1Index === index){
        return card1
      }else if(card2Index === index){
        return card2
      }
      return card;
    })
    this.setState({ deck: newDeck })
  }
  
  // returns nothing if the card is already flipped
  pickCard = (cardIndex) => {
    if(this.state.deck[cardIndex].isFlipped){
      return '';
    }
    // React won't let us mutate state directly, we have to use setState(), but since
    // our state has two arrays we want to push to, we unforutnately can do this.state.array.push(whatever)
    // we instaed have to create copies and use them to make our changes
    const cardToFlip = {...this.state.deck[cardIndex]};
    cardToFlip.isFlipped = true;
    // array.prototype.concat creates a copy and inserts that value in paren.
    let newPickedCards = this.state.pickedCards.concat(cardIndex);
    let matchedCards = this.state.matchedCards;
    const newDeck = this.state.deck.map((card, index)=>{
      if(cardIndex === index){
        return cardToFlip
      }
      // read directions
      return card;
    });

    if(newPickedCards.length === 2){
      const [card1Index, card2Index] = [newPickedCards[0], newPickedCards[1]];
      if(newDeck[card1Index].symbol !== newDeck[card2Index].symbol){ setTimeout(()=>{this.unflipCards(card1Index, card2Index)}, 1000) }
      if(newDeck[card1Index].symbol === newDeck[card2Index].symbol){matchedCards += 2}
      newPickedCards = [];
    }
    
    this.setState({
      deck: newDeck,
      pickedCards: newPickedCards,
      matchedCards: matchedCards,
      displayButton: matchedCards === 16
    })
  }

  render(){
    return (
      <div className="App">
        <div className="App-header">
          <h1>Memory Game</h1>
          
          {this.state.displayButton ? <h2>Congrats you won!!</h2> : <h2>Match Cards to win</h2>}
        </div>
        <div className="body">
        <div className="container">
          {this.state.deck.map((card, index)=>{
            // How to send props
            return <Card key={index} symbol={card.symbol} isFlipped={card.isFlipped} pickCard={this.pickCard.bind(this, index)}/>
          })}
        </div>
        </div>
        {this.state.displayButton ? <button onClick={this.resetGame}>Reset</button> : ''}
      </div>
    );
  }

}
export default App;