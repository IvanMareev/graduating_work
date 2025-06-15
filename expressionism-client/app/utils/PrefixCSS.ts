export default function prefixCSS(css, prefix) {
  // Добавляем префикс к каждому селектор (пример простой замены)
  return css.replace(/(^|\}|,)\s*([^{},]+)/g, (match, p1, selector) => {
    // Игнорируем @-директивы и keyframes
    if (selector.startsWith('@') || selector.includes('keyframes')) return match;

    // Добавляем префикс перед селектором
    const prefixedSelector = selector
      .split(',')
      .map(s => `.${prefix} ${s.trim()}`)
      .join(', ');

    return `${p1} ${prefixedSelector}`;
  });
}