export default function decorate(block) {
  [...block.children].forEach((row) => {
    const [question, answer] = row.children;
    if (row.children.length !== 2 || !question.textContent.trim()) {
      // eslint-disable-next-line no-console
      console.error('Accordion rows require a question and an answer cell.', row);
      return;
    }

    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = question.textContent.trim();
    answer.classList.add('accordion-answer');
    details.append(summary, answer);
    row.replaceWith(details);
  });
}
