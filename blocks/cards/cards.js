export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => {
    const ratio = (parseInt(img.height, 10) / parseInt(img.width, 10)) * 100;
    const picture = img.parentElement;
    picture.style.paddingBottom = `${ratio}%`;
  });
  block.textContent = '';
  block.append(ul);
}
