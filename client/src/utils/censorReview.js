import { Filter } from 'bad-words';

const filter = new Filter();
filter.addWords(
  'putangina', 'gago', 'tarantado', 'bobo', 'tangina', 'ulol',
  'pota', 'puta', 'hayop', 'lintik', 'leche', 'pakyu',
  'yawa', 'pisti', 'giatay', 'bwisit', 'punyeta', 'tae', 'kantot',
);

export const censorReview = (comment) =>
  comment ? filter.clean(comment) : 'No comment provided.';
