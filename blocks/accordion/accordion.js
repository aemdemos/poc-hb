import { moveInstrumentation } from '../../scripts/scripts.js';

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
        ul.querySelectorAll('.accordion-item.active').forEach((item) => item.classList.remove('active'));
        if (!isActive) li.classList.add('active');
      });
    }
    if (body !== null && body !== undefined) body.className = 'accordion-item-body';

    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
