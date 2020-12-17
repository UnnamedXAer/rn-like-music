import { ColorSchemeName } from '../hooks/useColorScheme';

const _colors = {
	lighter: '#EFF8E2',
	light: '#CECFC7',
	normal: '#ADA8B6',
	dark: '#573280',
	darker: '#23022E',
	placeholder: '#2f95dc',
	disabled: '#666',
	error: '#d00000',
	warning: '#ffba08',
	info: '#3a86ff',
} as const;

export type ThemeColors = {
	text: string;
	background: string;
	touchHighlight: string;
};

type AppColors = { [key in ColorSchemeName]: ThemeColors } & { colors: typeof _colors };

const Colors: AppColors = {
	light: {
		text: _colors.dark,
		background: _colors.lighter,
		touchHighlight: _colors.light,
	},
	dark: {
		text: _colors.light,
		background: _colors.darker,
		touchHighlight: _colors.dark,
	},
	colors: _colors,
};

export const playerIconsGradient = [
	'rgba(172,142,181,1)',
	'rgba(239,248,226,1)',
	'rgba(235,235,235,1)',
];

export default Colors;
