/** Cover-only motion. The photograph stays fixed beneath the moving apertures. */
export function installCoverMotion() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) entry.target.dataset.coverActive = String(entry.isIntersecting);
  });
  const register = root => {
    const covers = [...(root.matches?.('.edition-cover') ? [root] : []), ...root.querySelectorAll?.('.edition-cover') || []];
    for (const cover of covers) observer.observe(cover);
  };
  register(document);
  new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) if (node.nodeType === 1) register(node);
      for (const node of record.removedNodes) if (node.nodeType === 1) {
        if (node.matches('.edition-cover')) observer.unobserve(node);
        node.querySelectorAll('.edition-cover').forEach(cover => observer.unobserve(cover));
      }
    }
  }).observe(document.body, {childList:true, subtree:true});
  document.addEventListener('pointermove', event => {
    const cover = event.target.closest('.edition-cover');
    if (!cover || reduced.matches || event.pointerType === 'touch') return;
    const box = cover.getBoundingClientRect();
    cover.style.setProperty('--lava-x', `${((event.clientX-box.left)/box.width-.5)*22}px`);
    cover.style.setProperty('--lava-y', `${((event.clientY-box.top)/box.height-.5)*18}px`);
  }, {passive:true});
  document.addEventListener('pointerout', event => {
    const cover = event.target.closest('.edition-cover');
    if (cover && !cover.contains(event.relatedTarget)) {
      cover.style.removeProperty('--lava-x'); cover.style.removeProperty('--lava-y');
    }
  });
  const visibility = () => document.body.classList.toggle('cover-motion-hidden',document.hidden);
  document.addEventListener('visibilitychange',visibility); visibility();
}
