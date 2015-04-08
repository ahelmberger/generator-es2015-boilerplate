import greeter from './greeter';

function appendContent (content) {
  const div = document.createElement('div');
  div.textContent = content;
  document.body.appendChild(div);
}

appendContent(greeter.greet('ECMAScript 2015'));
