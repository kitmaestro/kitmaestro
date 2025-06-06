// Author: Michael Wehar
// Additional credits: Itay Livni, Michael Blättler
// MIT License

// Math functions
function distance(x1: number, y1: number, x2: number, y2: number): number {
	return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function weightedAverage(weights: number[], values: number[]): number {
	let temp = 0;

	for (let k = 0; k < weights.length; k++) {
		temp += weights[k] * values[k];
	}

	if (temp < 0 || temp > 1) {
		console.log('Error: ' + values);
	}

	return temp;
}

// Component scores
// 1. Number of connections
function computeScore1(connections: number, word: string): number {
	return connections / (word.length / 2);
}

// 2. Distance from center
function computeScore2(
	rows: number,
	cols: number,
	i: number,
	j: number,
): number {
	return 1 - distance(rows / 2, cols / 2, i, j) / (rows / 2 + cols / 2);
}

// 3. Vertical versus horizontal orientation
function computeScore3(
	a: number,
	b: number,
	verticalCount: number,
	totalCount: number,
): number {
	if (verticalCount > totalCount / 2) {
		return a;
	} else if (verticalCount < totalCount / 2) {
		return b;
	} else {
		return 0.5;
	}
}

// 4. Word length
function computeScore4(val: number, word: string) {
	return word.length / val;
}

// Word functions
function addWord(best: any, words: any, table: any) {
	const bestScore = best[0];
	const word = best[1];
	const index = best[2];
	const bestI = best[3];
	const bestJ = best[4];
	const bestO = best[5];

	words[index].startx = bestJ + 1;
	words[index].starty = bestI + 1;

	if (bestO === 0) {
		for (let k = 0; k < word.length; k++) {
			table[bestI][bestJ + k] = word.charAt(k);
		}
		words[index].orientation = 'across';
	} else {
		for (let k = 0; k < word.length; k++) {
			table[bestI + k][bestJ] = word.charAt(k);
		}
		words[index].orientation = 'down';
	}
	// console.log(word + ", " + bestScore);
}

function assignPositions(words: any) {
	const positions: any = {};
	for (const index in words) {
		const word = words[index];
		if (word.orientation != 'none') {
			const tempStr = word.starty + ',' + word.startx;
			if (tempStr in positions) {
				word.position = positions[tempStr];
			} else {
				// Object.keys is supported in ES5-compatible environments
				positions[tempStr] = Object.keys(positions).length + 1;
				word.position = positions[tempStr];
			}
		}
	}
}

function computeDimension(words: any, factor: any) {
	let temp = 0;
	for (let i = 0; i < words.length; i++) {
		if (temp < words[i].answer.length) {
			temp = words[i].answer.length;
		}
	}

	return temp * factor;
}

// Table functions
function initTable(rows: any, cols: any) {
	const table: string[][] = [];
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			if (j === 0) {
				table[i] = ['-'];
			} else {
				table[i][j] = '-';
			}
		}
	}

	return table;
}

function isConflict(
	table: any,
	isVertical: any,
	character: any,
	i: any,
	j: any,
) {
	if (character != table[i][j] && table[i][j] != '-') {
		return true;
	} else if (
		table[i][j] === '-' &&
		!isVertical &&
		i + 1 in table &&
		table[i + 1][j] != '-'
	) {
		return true;
	} else if (
		table[i][j] === '-' &&
		!isVertical &&
		i - 1 in table &&
		table[i - 1][j] != '-'
	) {
		return true;
	} else if (
		table[i][j] === '-' &&
		isVertical &&
		j + 1 in table[i] &&
		table[i][j + 1] != '-'
	) {
		return true;
	} else if (
		table[i][j] === '-' &&
		isVertical &&
		j - 1 in table[i] &&
		table[i][j - 1] != '-'
	) {
		return true;
	} else {
		return false;
	}
}

function attemptToInsert(
	rows: any,
	cols: any,
	table: any,
	weights: any,
	verticalCount: any,
	totalCount: any,
	word: any,
	index: any,
) {
	let bestI = 0;
	let bestJ = 0;
	let bestO = 0;
	let bestScore = -1;

	// Horizontal
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols - word.length + 1; j++) {
			var isValid = true;
			var atleastOne = false;
			var connections = 0;
			var prevFlag = false;

			for (let k = 0; k < word.length; k++) {
				if (isConflict(table, false, word.charAt(k), i, j + k)) {
					isValid = false;
					break;
				} else if (table[i][j + k] === '-') {
					prevFlag = false;
					atleastOne = true;
				} else {
					if (prevFlag) {
						isValid = false;
						break;
					} else {
						prevFlag = true;
						connections += 1;
					}
				}
			}

			if (j - 1 in table[i] && table[i][j - 1] != '-') {
				isValid = false;
			} else if (
				j + word.length in table[i] &&
				table[i][j + word.length] != '-'
			) {
				isValid = false;
			}

			if (isValid && atleastOne && word.length > 1) {
				var tempScore1 = computeScore1(connections, word);
				var tempScore2 = computeScore2(
					rows,
					cols,
					i,
					j + word.length / 2,
				);
				var tempScore3 = computeScore3(1, 0, verticalCount, totalCount);
				var tempScore4 = computeScore4(rows, word);
				var tempScore = weightedAverage(weights, [
					tempScore1,
					tempScore2,
					tempScore3,
					tempScore4,
				]);

				if (tempScore > bestScore) {
					bestScore = tempScore;
					bestI = i;
					bestJ = j;
					bestO = 0;
				}
			}
		}
	}

	// Vertical
	for (let i = 0; i < rows - word.length + 1; i++) {
		for (let j = 0; j < cols; j++) {
			var isValid = true;
			var atleastOne = false;
			var connections = 0;
			var prevFlag = false;

			for (let k = 0; k < word.length; k++) {
				if (isConflict(table, true, word.charAt(k), i + k, j)) {
					isValid = false;
					break;
				} else if (table[i + k][j] === '-') {
					prevFlag = false;
					atleastOne = true;
				} else {
					if (prevFlag) {
						isValid = false;
						break;
					} else {
						prevFlag = true;
						connections += 1;
					}
				}
			}

			if (i - 1 in table && table[i - 1][j] != '-') {
				isValid = false;
			} else if (
				i + word.length in table &&
				table[i + word.length][j] != '-'
			) {
				isValid = false;
			}

			if (isValid && atleastOne && word.length > 1) {
				var tempScore1 = computeScore1(connections, word);
				var tempScore2 = computeScore2(
					rows,
					cols,
					i + word.length / 2,
					j,
				);
				var tempScore3 = computeScore3(0, 1, verticalCount, totalCount);
				var tempScore4 = computeScore4(rows, word);
				var tempScore = weightedAverage(weights, [
					tempScore1,
					tempScore2,
					tempScore3,
					tempScore4,
				]);

				if (tempScore > bestScore) {
					bestScore = tempScore;
					bestI = i;
					bestJ = j;
					bestO = 1;
				}
			}
		}
	}

	if (bestScore > -1) {
		return [bestScore, word, index, bestI, bestJ, bestO];
	} else {
		return [-1];
	}
}

function generateTable(
	table: any,
	rows: any,
	cols: any,
	words: any,
	weights: any,
) {
	let verticalCount = 0;
	let totalCount = 0;

	for (const outerIndex in words) {
		let best = [-1];
		for (const innerIndex in words) {
			if (
				'answer' in words[innerIndex] &&
				!('startx' in words[innerIndex])
			) {
				const temp = attemptToInsert(
					rows,
					cols,
					table,
					weights,
					verticalCount,
					totalCount,
					words[innerIndex].answer,
					innerIndex,
				);
				if (temp[0] > best[0]) {
					best = temp;
				}
			}
		}

		if (best[0] === -1) {
			break;
		} else {
			addWord(best, words, table);
			if (best[5] === 1) {
				verticalCount += 1;
			}
			totalCount += 1;
		}
	}

	for (const index in words) {
		if (!('startx' in words[index])) {
			words[index].orientation = 'none';
		}
	}

	return { table: table, result: words };
}

function removeIsolatedWords(data: any) {
	const oldTable = data.table;
	const words = data.result;
	const rows = oldTable.length;
	const cols = oldTable[0].length;
	let newTable = initTable(rows, cols);

	// Draw intersections as "X"'s
	for (const wordIndex in words) {
		var word = words[wordIndex];
		if (word.orientation === 'across') {
			var i = word.starty - 1;
			var j = word.startx - 1;
			for (let k = 0; k < word.answer.length; k++) {
				if (newTable[i][j + k] === '-') {
					newTable[i][j + k] = 'O';
				} else if (newTable[i][j + k] === 'O') {
					newTable[i][j + k] = 'X';
				}
			}
		} else if (word.orientation === 'down') {
			var i = word.starty - 1;
			var j = word.startx - 1;
			for (let k = 0; k < word.answer.length; k++) {
				if (newTable[i + k][j] === '-') {
					newTable[i + k][j] = 'O';
				} else if (newTable[i + k][j] === 'O') {
					newTable[i + k][j] = 'X';
				}
			}
		}
	}

	// Set orientations to "none" if they have no intersections
	for (const wordIndex in words) {
		var word = words[wordIndex];
		let isIsolated = true;
		if (word.orientation === 'across') {
			var i = word.starty - 1;
			var j = word.startx - 1;
			for (let k = 0; k < word.answer.length; k++) {
				if (newTable[i][j + k] === 'X') {
					isIsolated = false;
					break;
				}
			}
		} else if (word.orientation === 'down') {
			var i = word.starty - 1;
			var j = word.startx - 1;
			for (let k = 0; k < word.answer.length; k++) {
				if (newTable[i + k][j] === 'X') {
					isIsolated = false;
					break;
				}
			}
		}
		if (word.orientation != 'none' && isIsolated) {
			delete words[wordIndex].startx;
			delete words[wordIndex].starty;
			delete words[wordIndex].position;
			words[wordIndex].orientation = 'none';
		}
	}

	// Draw new table
	newTable = initTable(rows, cols);
	for (const wordIndex in words) {
		var word = words[wordIndex];
		if (word.orientation === 'across') {
			var i = word.starty - 1;
			var j = word.startx - 1;
			for (let k = 0; k < word.answer.length; k++) {
				newTable[i][j + k] = word.answer.charAt(k);
			}
		} else if (word.orientation === 'down') {
			var i = word.starty - 1;
			var j = word.startx - 1;
			for (let k = 0; k < word.answer.length; k++) {
				newTable[i + k][j] = word.answer.charAt(k);
			}
		}
	}

	return { table: newTable, result: words };
}

function trimTable(data: any) {
	const table = data.table;
	const rows = table.length;
	const cols = table[0].length;

	let leftMost = cols;
	let topMost = rows;
	let rightMost = -1;
	let bottomMost = -1;

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			if (table[i][j] != '-') {
				const x = j;
				const y = i;

				if (x < leftMost) {
					leftMost = x;
				}
				if (x > rightMost) {
					rightMost = x;
				}
				if (y < topMost) {
					topMost = y;
				}
				if (y > bottomMost) {
					bottomMost = y;
				}
			}
		}
	}

	const trimmedTable = initTable(
		bottomMost - topMost + 1,
		rightMost - leftMost + 1,
	);
	for (let i = topMost; i < bottomMost + 1; i++) {
		for (let j = leftMost; j < rightMost + 1; j++) {
			trimmedTable[i - topMost][j - leftMost] = table[i][j];
		}
	}

	const words = data.result;
	for (const entry in words) {
		if ('startx' in words[entry]) {
			words[entry].startx -= leftMost;
			words[entry].starty -= topMost;
		}
	}

	return {
		table: trimmedTable,
		result: words,
		rows: Math.max(bottomMost - topMost + 1, 0),
		cols: Math.max(rightMost - leftMost + 1, 0),
	};
}

function generateSimpleTable(words: any) {
	const rows = computeDimension(words, 3);
	const cols = rows;
	const blankTable = initTable(rows, cols);
	const table = generateTable(
		blankTable,
		rows,
		cols,
		words,
		[0.7, 0.15, 0.1, 0.05],
	);
	const newTable = removeIsolatedWords(table);
	const finalTable = trimTable(newTable);
	assignPositions(finalTable.result);
	return finalTable;
}

export interface CrossWordLayout {
	table: string[][];
	result: {
		clue: string;
		answer: string;
		startx: number;
		starty: number;
		orientation: string;
		position: number;
	}[];
	rows: number;
	cols: number;
}

export function generateLayout(words_json: any): CrossWordLayout {
	const layout = generateSimpleTable(words_json);
	return layout;
}
