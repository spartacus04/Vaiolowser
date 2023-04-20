const wrapBorder = (text: string, character: string, config: { top? : boolean, bottom? : boolean, left? : boolean, right? : boolean } = {
	top: true,
	bottom: true,
	left: true,
	right: true
}) : string => {
	const { top, left, bottom, right } = config;
	const lineSize = maxLineSize(text);
	const split = text.split('\n');

	let txt = '';

	// top left
	let topLine = top && left ? character : '';
	//top
	topLine += top ? character.repeat(lineSize) : '';
	// top right
	topLine += top && right ? character : '';

	txt += topLine.length > 0 ? topLine + '\n' : '';

	for(const line of split) {
		// left
		txt += left ? character : '';
		// text
		txt += line;
		// right
		txt += right ? character : '';
		txt += '\n';
	}

	// bottom left
	let bottomLine = bottom && left ? character : '';
	//bottom
	bottomLine += bottom ? character.repeat(lineSize) : '';
	// bottom right
	bottomLine += bottom && right ? character : '';

	txt += bottomLine.length > 0 ? bottomLine + '\n' : '';

	return txt.slice(0, -1);
};

const maxLineSize = (text: string) : number => {
	const lines = text.split('\n');

	let max = 0;

	for(const line of lines) {
		if(line.length > max) max = line.length;
	}

	return max;
};

const columnSize = (text: string) : number => {
	const lines = text.split('\n');

	return lines.length;
}