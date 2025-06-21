export default function prefixCSS(css, prefix) {
  return css.replace(/(^|\}|,)\s*([^{},]+)/g, (match, p1, selector) => {
    if (selector.startsWith('@') || selector.includes('keyframes')) return match;

    const prefixedSelector = selector
      .split(',')
      .map(s => `.${prefix} ${s.trim()}`)
      .join(', ');

    return `${p1} ${prefixedSelector}`;
  });
}