// A face and an opening are different: covers occupy only one side.
export function createPagination(pages) {
  if (pages.length < 4 || pages.length % 2) throw new RangeError('A sequência física deve conter um número par de faces.');
  const spreadCount = pages.length / 2 + 1;
  const clampSpread = value => Math.max(0, Math.min(spreadCount - 1, Math.trunc(Number(value) || 0)));
  const spreadForPage = value => {
    const index = Math.max(0, Math.min(pages.length - 1, Math.trunc(Number(value) || 0)));
    return index === pages.length - 1 ? spreadCount - 1 : Math.ceil(index / 2);
  };
  function getOpening(value) {
    const opening = clampSpread(value);
    const leftIndex = opening === 0 ? null : opening === spreadCount - 1 ? pages.length - 1 : opening * 2 - 1;
    const rightIndex = opening === spreadCount - 1 ? null : opening === 0 ? 0 : opening * 2;
    return { left: leftIndex === null ? null : pages[leftIndex], right: rightIndex === null ? null : pages[rightIndex], leftIndex, rightIndex };
  }
  const getSpread = value => { const opening = getOpening(value); return [opening.left, opening.right].filter(Boolean); };
  const contentCount = pages.filter(page=>Number.isInteger(page.folio)).length;
  const formatPage = page => Number.isInteger(page.folio) ? `${String(page.folio).padStart(2,'0')} / ${contentCount}` : page.readingLabel;
  const formatPages = value => { const selection=getSpread(value); return selection.every(page=>Number.isInteger(page.folio)) ? `${selection.map(page=>String(page.folio).padStart(2,'0')).join(' e ')} / ${contentCount}` : selection.map(formatPage).join(' · '); };
  return { spreadCount, clampSpread, spreadForPage, getOpening, getSpread, formatPages, formatPage };
}
