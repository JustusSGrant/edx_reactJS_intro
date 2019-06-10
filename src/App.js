import React from 'react';
import ReactDOM from 'react-dom';
import { arrayExpression } from '@babel/types';

/* 
  MODULE 2  
*/
class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    }
  }

  componentDidMount() {
    this.setState((prevState, props) => {
      return {value: prevState.value + 1}
    });
  }
  
  render() {
    return <h1>{this.state.value}</h1>
  }
}

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    }
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    this.setState({
      count: this.state.count + 1
    });
  }

  render() {
    return <button onClick={ this.clickHandler }>{this.state.count}</button>
  }
}

class Details extends React.Component {
  render() {
    return <h1>{this.props.details}</h1>
  }
}

class Button extends React.Component {
  render () {
    return (
      <button style = {{color: this.props.active ? 'red' : 'blue'}} 
        onClick = {() => this.props.clickHandler(this.props.id, this.props.name)}>
        { this.props.name }
      </button>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeArray: [0, 0, 0, 0],
      details: ""
    }
    this.clickHandler = this.clickHandler.bind(this)
  }

  clickHandler(id, details) {
    var arr = [0, 0, 0, 0];
    arr[id] = 1;
    this.setState({
      activeArray: arr,
      details: details
    });
  }

  render() {
    return (
      <div>
        <h1>Module 2 Practice</h1>
        <Button id={ 0 } clickHandler={ this.clickHandler } active={ this.state.activeArray[0] } name="One" />
        <Button id={ 1 } clickHandler={ this.clickHandler } active={ this.state.activeArray[1] } name="Two" />
        <Button id={ 2 } clickHandler={ this.clickHandler } active={ this.state.activeArray[2] } name="Three" />
        <Button id={ 3 } clickHandler={ this.clickHandler } active={ this.state.activeArray[3] } name="Four" />
        <Details details={ this.state.details } />
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

/* 
  Module 2 Assessment: Connect 4
*/

function Circle(props) {
  var color = "white";
  if(props.cell === 1) {
    color = "black";
  } else if(props.cell === 2) {
    color = "red";
  }

  var style = {
    backgroundColor: color,
    border: "1px solid black",
    borderRadius: "100%",
    paddingTop: "98%"
  }

  return (
    <div style = {style}></div>
  )
}

function Cell(props) {
  var style = {
    height: 50,
    width: 50,
    border: "1px solid black",
    backgroundColor: "yellow"
  }

  return (
    <div style={style} onClick={() => props.handleClick(props.row,  props.col)}>
      <Circle cell={ props.cell } />
    </div>
  );
}

function Row(props) {
  var cells = [];
  var style = {
    display: "flex"
  };

  for(let i = 0; i < 7; i++) {
    cells.push(<Cell key={ i } cell={ props.cells[i] } row={ props.row } col={ i } handleClick={ props.handleClick } />)
  } 

  return (
    <div style={style}>
      {cells}
    </div>
  )
}

function Board(props) {
  var rows = [];
  for(let i = 0; i < 6; i++) {
    rows.push(<Row key={ i } row={ i } cells={ props.cells[i] } handleClick={ props.handleClick }/>);
  }

  return (
    <div>
      {rows}
    </div>
  )
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    var cells = [];
    for(let i = 0; i < 6; i++) {
      cells.push(new Array(7).fill(0));
    }
    // Game Component State
    this.state = {
      player: false,
      cells: cells,
      winner: 0
    };

    // Event Binding
    this.handleClick = this.handleClick.bind(this);
    this.restart = this.restart.bind(this);
  }

  findAvailableRow(col) {
    for(var i = 5; i >= 0; i--) {
      if(this.state.cells[i][col] === 0) {
        return i;
      }
    }
    return -1;
  }

  handleClick(row, col) {
    if(this.state.winner) {
      return;
    }
    var temp = [];
    for(let i = 0; i < 6; i++) {
      temp.push(this.state.cells[i].slice());
    }
    var newRow = this.findAvailableRow(col);
    if(newRow >= 0) {
      temp[newRow][col] = this.state.player ? 1 : 2;
      this.setState({cells: temp, player: !this.state.player}, () => {
        if(this.checkVictory(row, col) > 0) {
          this.setState({winner: this.state.player ? 2 : 1});
        }
      });
    }
  }

  checkDiagonal(row, col){
    var c = this.state.cells;
    var val = this.state.player ? 2 : 1;
    
    var rR = row;
    var cR = col;
    while(rR < 5 && cR < 6) {
      rR++;
      cR++;
    }
    while(rR >= 3 && cR >= 6) {
      if(
        c[rR][cR] === val && 
        c[rR-1][cR-1] === val && 
        c[rR-2][cR-2] === val &&
        c[rR-3][cR-3] === val) {
          return 1;
        }
        rR--;
        cR--;
    }

    var rL = row;
    var cL = col;
    while(rL < 5 && cL > 0) {
      rL++;
      cL--;
    }
    while(rL >= 3 && cL <= 3){
      if(
        c[rL][cL] === val &&
        c[rL-1][cL-1] === val &&
        c[rL-2][cL+2] === val &&
        c[rL-3][cL+3] === val) {
          return 1;
        }
      rL--;
      cL++;
    }
    return 0;
  }

  checkHorizontal(row, col) {
    var c = this.state.cells;
    var i = 6;
    var val = this.state.plyer ? 2 : 1;
    while(i >= 3) {
      if(
        c[row][i] === val &&
        c[row][i-1] === val &&
        c[row][i-2] === val &&
        c[row][i-3] === val
      ) {
        return 1;
      }
      i--;
    }
    return 0;
  }

  checkVertical(row, col) {
    var c = this.state.cells;
    var i = row;
    var val = this.state.player ? 2 : 1;

    if (i >= 3) {
      if(
        c[i][col] === val &&
        c[i-1][col] === val &&
        c[i-2][col] === val &&
        c[i-3][col] === val) {
          return 1;
        }
    }
    return 0;
  }

  checkVictory(row, col) {
    return this.checkVertical(row, col) || this.checkHorizontal(row, col) || this.checkDiagonal(row, col);
  }

  restart() {
    var cells = [];
    for(let i = 0; i < 6; i++) {
      cells.push(new Array(7).fill(0));
    }
    this.setState({
      player: false,
      cells: cells,
      winner: 0
    });
  }

  render() {
    return (
      <div>
        <h1>Connect 4</h1>   
        <h2>{this.state.winner > 0 ?  this.state.winner == 1? "Black Wins":"Red Wins": this.state.player? "Blacks Turn" : "Reds Turn"} </h2>
        <Board cells={ this.state.cells } handleClick={ this.handleClick } />
        <button onClick={() => this.restart()}>Restart</button>
      </div>
    )
  }
}

/* 
  Module 2 Lab
*/


function Question(props) {
  let question = `What is ${props.factor1} x ${props.factor2}?`
  return(
      <h1>{question}</h1>
  )
}

function Options(props) {
  var srcSet = props.options;
  var options = [];
  for (let i = 0; i < srcSet.length; i++) {
    options.push(
      <button key={i} onClick={ () => props.handleClick(srcSet[i]) }>
        { srcSet[i] }
      </button>
    )
  }
  return (
    <div> 
      { options } 
    </div>
  )
}

class Trivia extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          correct: 0,
          incorrect: 0,
          factor1: 0,
          factor2: 0,
          rand1: 0,
          rand2: 0,
          rand3: 0,
          rand4: 0
      }

      // Event Binding
      this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
      var [f1, f2, r1, r2, r3, r4] = this.generateNumbers();
      
      this.setState({
          factor1: f1,
          factor2: f2,
          rand1: r1,
          rand2: r2,
          rand3: r3,
          rand4: r4
      });
  }

  handleClick(val) {
    let isCorrect = val === this.state.factor1 * this.state.factor2;
    var [f1, f2, r1, r2, r3, r4] = this.generateNumbers();
    let tempState = {
      correct: isCorrect ? this.state.correct + 1 : this.state.correct,
      incorrect: isCorrect ? this.state.incorrect : this.state.incorrect + 1,
      factor1: f1,
      factor2: f2,
      rand1: r1,
      rand2: r2,
      rand3: r3,
      rand4: r4
    };
    this.setState(tempState);
  }

  generateNumbers(){
      var randNumAry = [];
      for (let i = 0; i < 6; i++) {
          let range = i < 2 ? 100 : 1000;
          let temp = Math.random() * Math.floor(range);
          temp = Math.ceil(temp);
          randNumAry.push(temp);
      }
      return randNumAry;
  }

  render() {
      let optAry = [
        this.state.factor1 * this.state.factor2,
        this.state.rand1,
        this.state.rand2,
        this.state.rand3,
        this.state.rand4
      ]
      let status = `Correct: ${this.state.correct} | Incorrect: ${ this.state.incorrect }`;
      return(
          <div>
              <h1>{  status }</h1>
              <Question factor1={ this.state.factor1 } factor2={ this.state.factor2 }/>
              <Options options={ optAry } handleClick={ this.handleClick } />
              
          </div>
      );
  }

}


function M2Lab() {
  return (
    <div className="trivia-container">
      <Trivia />
    </div>
  );
}

ReactDOM.render(
  <M2Lab />,
  document.getElementById('M2Lab')
)


ReactDOM.render(
  <Game />,
  document.getElementById('connect4')
)

/* 
  MODULE 3
*/

class GenerateDynamiList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    }

    // Event Binding
  }

  componentDidMount() {
    var products = [
      {id: 100, product: "Apple", price: 3},
      {id: 101, product: "Banana", price: 2},
      {id: 102, product: "Carrot", price: 6},
      {id: 103, product: "Donuts", price: 9},
      {id: 104, product: "Eggplant", price: 4}
    ]
    this.setState({ products: products });
  }

  render() {
    var elements = this.state.products.map((item, index) => 
    {
      return (
        <li key={ item.id }>
          product: { item.product } | Price: { item.price }
        </li>
      )
    });

    return (
      <ol>
        { elements }
      </ol>
    )
  }
}

class ControllerInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };

    // Event Binding
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value }, () => console.log(this.state.value));
  }

  render() {
    return (
      <div>
        <h1>Module 3</h1>
        <input onChange={ this.handleChange } />
        <GenerateDynamiList />
      </div>
    );
  }
}

ReactDOM.render(
  <ControllerInput />,
  document.getElementById('m3')
);


/* 
  Module 3 Lab: Blog
*/
function PostButton(props) {
  var style = {
    width: 24,
    height: 24
  }

  return (
    <button style={ style } onClick={() => props.handleClick()}>{ props.label }</button>
  );
}

function PostText(props) {
  var style = {
    border: "px solid black",
    width: props.width
  }

  return (
    <div style={ style }>{ props.text }</div>
  );
}

function Post(props) {
  var style = {
    display: 'flex'
  }

  return (
    <div style={ style }>
      <PostButton label="x" handleClick={ props.removeItem } />
      <PostText text={ props.title } width="200" />
      <PostButton label="+" handleClick={ props.incrementScore } />
      <PostText text={ props.score } width="20" />
      <PostButton label="-" handleClick={ props.decrementScore } />
    </div>
  )
}

function PostList(props) {
  return (
    <ol>
      {
        props.postList.map((item, index) => 
        <Post 
          key={ index }
          title={ item.title }
          score={ item.score }
          incrementScore={ () => props.updateScore(index, 1) }
          decrementScore={() => props.updateScore(index, -1) }
          removeItem={() => props.removeItem(index)}
        />
        )
      }
    </ol>
  )
}

class M3App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      items: []
    }

    // Event Binding
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    }, () => console.log(this.state.value));
  }

  addItems() {
    var itemsCopy = this.state.items.slice();
    var truncatedString = this.state.value.substring(0, 20);
    itemsCopy.push({
      "title": truncatedString,
      "score": 0
    });
    itemsCopy.sort((a, b) => {
      return b.score - a.score;
    });
    this.setState({
      items: itemsCopy,
      value: ""
    });
  }

  updateScore(index, val) {
    var itemsCopy = this.state.items.slice();
    itemsCopy[index].score += val;
    itemsCopy.sort((a, b) => {
      return b.score - a.score;
    });
    this.setState({items: itemsCopy});
  }

  removeItem(index) {
    var itemsCopy = this.state.items.slice();
    itemsCopy.splice(index, 1);
    itemsCopy.sort((a, b) => {
      return b.score - a.score
    });
    this.setState({items: itemsCopy});
  }

  render() {
    return (
      <div>
        <input value={ this.state.value } onChange={ this.handleChange.bind(this) } />
        <button onClick={() => this.addItems()}>Submit</button>
        <PostList 
          postList={ this.state.items } 
          updateScore={ this.updateScore.bind(this) } 
          removeItem={ this.removeItem.bind(this) }
        />
      </div>
    )
  }
}

ReactDOM.render(
  <M3App />,
  document.getElementById('m3Forms')
);