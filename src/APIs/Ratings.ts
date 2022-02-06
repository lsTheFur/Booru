export default const ratings: Record<
  's' | 'q' | 'e' | 'safe' | 'questionable' | 'explicit',
  'safe' | 'questionable' | 'explicit'
> = {
  s: 'safe',
  q: 'questionable',
  e: 'explicit',
  safe: 'safe',
  questionable: 'questionable',
  explicit: 'explicit',
};
