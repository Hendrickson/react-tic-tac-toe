import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return (
		<button className={props.winner ? "square winner" : "square"} onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i, winner) {
		return (
			<Square
				key={"square-"+i}
				value={this.props.squares[i]}
				winner={winner}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		var boardSize = 3;
		var rows = [];
		for (let i = 0; i < boardSize; i++) {
			var columns = [];
			for (let j = 0; j < boardSize; j++) {
				let squareNumber = (boardSize * i) + j;
				let isWinner = false;
				if (this.props.winner) {
					for (let k = 0; k < boardSize; k++) {
						if (this.props.winner[k] === squareNumber) {
							isWinner = true;
						}
					}
				}
				columns.push(this.renderSquare(squareNumber, isWinner));
			}
			rows.push(
				<div key={"row-"+i} className="board-row">
					{columns}
				</div>
			);
		}
		return (
			<div>
				{rows}
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				clickedSquare: null,
			}],
			stepNumber: 0,
			xIsNext: true,
			isAscendingOrder: true,
		}
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares,
				clickedSquare: i,
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		})
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		});
	}

	toggleOrder() {
		let isAscendingOrder = !this.state.isAscendingOrder
		this.setState({
			isAscendingOrder: isAscendingOrder,
		});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		const moves = history.map((step, move) => {
			const desc = move ?
				'Go to move #' + move + ' -> Clicked square: (' + step.clickedSquare % 3 + ', ' + Math.floor(step.clickedSquare / 3) + ')':
				'Go to game start';
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}><span className={move === this.state.stepNumber ? 'bold' : null}>{desc}</span></button>
				</li>
			)
		})
		const sortedMoves = this.state.isAscendingOrder ? moves : moves.reverse();

		let status;
		if (winner) {
			status = 'Winner: ' + current.squares[winner[0]];
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board squares={current.squares} winner={winner} onClick={(i) => this.handleClick(i)}/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{sortedMoves}</ol>
				</div>
				<div>
					<button onClick={() => this.toggleOrder()}>Toggle order</button>
				</div>
			</div>
		);
	}
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);

function calculateWinner(squares) {
	const lines = [
		[0,1,2],
		[3,4,5],
		[6,7,8],
		[0,3,6],
		[1,4,7],
		[2,5,8],
		[0,4,8],
		[2,4,6],
	];

	for (let i = 0; i < lines.length; i++) {
		const [a,b,c] = lines[i]
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return lines[i];
		}
	}
	return null;
}
