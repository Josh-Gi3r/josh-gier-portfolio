import {installScreenGeometry} from './screens.js';
import {installSound} from './sound.js?v=4';

const plane = document.querySelector('#room-plane');
const returnButton = document.querySelector('#study-return');
const destinationPanel = document.querySelector('#study-destination');
const destinationLink = document.querySelector('#study-project-link');
const labels = {campaigns: 'Campaigns', products: 'Products', about: 'About & CV'};
const targets = {campaigns: [.773,.54,3.15], products: [.54,.33,4.3], about: [.435,.205,2.6]};
installScreenGeometry(plane);
installSound();

let origin = null;
function resetRoom() {
  document.body.classList.remove('study-zoomed');
  document.querySelector('#room').inert = false;
  plane.style.transform = 'translate(-50%,-50%)';
  returnButton.hidden = true;
  destinationPanel.hidden = true;
  origin?.focus({preventScroll: true});
}
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  const destination = link.hash.slice(1);
  if (destination === 'room') { event.preventDefault(); resetRoom(); return; }
  if (!targets[destination]) { link.href = `/index.html#${destination}`; return; }
  event.preventDefault();
  origin = link;
  const [x,y,scale] = targets[destination];
  const w = plane.offsetWidth, h = plane.offsetHeight;
  document.body.classList.add('study-zoomed');
  document.querySelector('#room').inert = true;
  plane.style.transform = `translate(-50%,-50%) translate(${(.5-x)*w*scale}px,${(.5-y)*h*scale}px) scale(${scale})`;
  destinationPanel.querySelector('span').textContent = labels[destination];
  destinationLink.href = `/index.html#${destination}`;
  returnButton.hidden = false;
  destinationPanel.hidden = false;
  returnButton.focus({preventScroll: true});
});
returnButton.addEventListener('click', resetRoom);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && document.body.classList.contains('study-zoomed')) resetRoom();
});
document.querySelector('#motion-toggle').addEventListener('click', () => {
  const paused = document.body.classList.toggle('paused');
  const button = document.querySelector('#motion-toggle');
  button.setAttribute('aria-pressed', String(paused));
  button.innerHTML = paused ? 'Play motion <span>▷</span>' : 'Pause motion <span>Ⅱ</span>';
});
if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('paused');
  document.querySelector('#motion-toggle').setAttribute('aria-pressed', 'true');
  document.querySelector('#motion-toggle').innerHTML = 'Play motion <span>▷</span>';
}
