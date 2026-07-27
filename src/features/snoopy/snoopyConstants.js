// src/features/snoopy/snoopyConstants.js

export const SNOOPY_BASE_PATH = './images/snoopy/';

export const resolveSnoopyAsset = (filename) => {
  if (!filename) return null;
  return `${SNOOPY_BASE_PATH}${filename}`;
};

export const SNOOPY_SCENE_1 = {
  hero: 'snoopyrelaxingonrock.webp',
  items: ['snoopy-sleep.gif', 'rush-late-snoopy.gif', 'snoopy-hot.gif']
};

export const SNOOPY_SCENE_2 = {
  hero: 'snoopysit.webp',
  items: ['snoopyhugg.gif', 'snoopy-I-see.gif', 'snoopy-yay.gif']
};

export const SNOOPY_SCENE_3 = {
  hero: 'snoopyflower.webp',
  items: ['giving-gift-snoopy.gif', 'hugging-heart-snoopy.gif', 'snoopy_beating_heart.gif']
};

export const SNOOPY_SCENE_4 = {
  hero: null,
  items: ['cheer-snoopy.gif', 'snoopyredbowtie.gif', 'snoopy-cry.gif']
};

export const SNOOPY_COLOR_STOPS = [
  { pct: 0,   color: '#3b0a2a' },
  { pct: 8,   color: '#6b1441' },
  { pct: 22,  color: '#9d2160' },
  { pct: 30,  color: '#c2185b' },
  { pct: 38,  color: '#f06292' },
  { pct: 48,  color: '#f8bbd0' },
  { pct: 58,  color: '#fce4ec' },
  { pct: 74,  color: '#f48fb1' },
  { pct: 84,  color: '#ec407a' },
  { pct: 92,  color: '#ad1457' },
  { pct: 100, color: '#4a0e2e' }
];

export const buildSnoopyGradientCss = (stops) => {
  const stopsString = stops.map(stop => `${stop.color} ${stop.pct}%`).join(', ');
  return `linear-gradient(to bottom, ${stopsString})`;
};
