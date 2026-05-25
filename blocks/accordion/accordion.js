import { moveInstrumentation } from '../../scripts/scripts.js';

function collapseItem(item) {
  item.classList.remove('active');
  const body = item.querySelector('.accordion-item-body');
  if (body) body.style.maxHeight = '0';
}

function expandItem(item) {
  item.classList.add('active');
  const body = item.querySelector('.accordion-item-body');
  if (body) body.style.maxHeight = `${body.scrollHeight}px`;
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'accordion-item';
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);

    const [label, body] = [...li.children];
    if (label !== null && label !== undefined) {
      label.className = 'accordion-item-label';
      label.addEventListener('click', () => {
        const isActive = li.classList.contains('active');
        ul.querySelectorAll('.accordion-item.active').forEach((item) => collapseItem(item));
        if (!isActive) expandItem(li);
      });
    }
    if (body !== null && body !== undefined) body.className = 'accordion-item-body';

    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
