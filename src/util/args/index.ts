export * from './base';
export * from './string';
export * from './integer';
export * from './float';

import { type } from './base';
import { floatType } from './float';
import { integerType } from './integer';
import { stringType } from './string';

export const parseArgument = (arg: string, argType: string) : any => {
	const argTypes = argType.split('|');

	const typesToValidate: type[] = [];

	argTypes.forEach(argt => {
		switch(argt) {
		case 'string':
			typesToValidate.push(new stringType());
			break;
		case 'integer':
			typesToValidate.push(new integerType());
			break;
		case 'float':
			typesToValidate.push(new floatType());
			break;
		}
	});

	for(let i = 0; i < typesToValidate.length; i++) {
		if(typesToValidate[i].validate(arg)) {
			return typesToValidate[i].parse(arg);
		}
	}

	return null;
};