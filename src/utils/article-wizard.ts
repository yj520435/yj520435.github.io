export default class ArticleWizard {
  root?: HTMLElement;

  target?: Element | HTMLElement | null;
  text?: string;
  isTyping?: boolean;

  init(root: HTMLElement) {
    this.root = root;
  }

  create(name: string, value = '', props?: { [key: string]: string }) {
    const element = document.createElement(name);
    element.innerHTML = value;

    if (props) {
      Object.keys(props).forEach((key) => {
        element.setAttribute(key, props[key]);
      });
    }

    return element;
  }

  focus(node: Node, offset?: number) {
    const selection = window.getSelection();
    if (!selection) return;
    selection.removeAllRanges();

    const range = document.createRange();

    if (offset) {
      range.setStart(node, offset);

      if (offset > 0) range.setEnd(node, offset);
    } else {
      range.selectNodeContents(node);
    }

    range.collapse(false);
    selection.addRange(range);
  }

  find(regexp: RegExp) {
    if (!this.text) return;
    const matched = Array.from(this.text.matchAll(regexp));
    return matched.length > 0 ? matched : null;
  }

  clear(element?: Element) {
    this.isTyping = Boolean(!element);

    if (element) {
      this.target = element;
      this.text = element.innerHTML;
    } else {
      const { node } = getCursor();
      if (!node) return;
      this.target = node instanceof HTMLElement ? node : node?.parentElement;
      this.text = node?.textContent ?? '';
    }
  }

  input(args?: Element) {
    this.clear(args);
    if (!this.target) return;

    const codeblockValues = this.find(/```(\w*)(\n?)(?:((?:.*\n)*)```)*/g);
    codeblockValues?.forEach((v) => {
      const next = this.target?.nextElementSibling;

      const code = (v[3] ?? '').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
      const parent = this.create('pre');
      const child = this.create('code', code);
      parent.append(child);
      this.target?.replaceWith(parent);

      if (!args && !next) parent.insertAdjacentHTML('afterend', '<p></p>');
      if (v[1]) parent?.firstElementChild?.classList.add(v[1]);
    });

    const headerValues = this.find(/^#{1,6}\s(.*)$/g);
    headerValues?.forEach((v) => {
      const size = (v[0].match(/#/g) ?? []).length;
      const h = this.create(`h${size}`, v[1]);
      this.target?.replaceWith(h);
    });

    const blockquoteValues = this.find(/^(?:>|&gt;)\s(.*)/g);
    blockquoteValues?.forEach((v) => {
      const prev = this.target?.previousElementSibling;
      const next = this.target?.nextElementSibling;

      if (prev?.tagName === 'BLOCKQUOTE') {
        prev.innerHTML = prev.innerHTML + `<p>${v[1]}</p>`;
        this.target?.remove();
      } else {
        const blockquote = this.create('blockquote');
        const p = this.create('p', v[1]);
        blockquote.appendChild(p);

        this.target?.replaceWith(blockquote);
        if (!args && !next) blockquote.insertAdjacentHTML('afterend', '<p></p>');

        this.clear(blockquote);
      }
    });

    const unorderedListValues = this.find(/^\s*\*\s(.*\n*)/gm);
    unorderedListValues?.forEach((v, i) => {
      const depth = v[0].indexOf('*');
      const listItem = this.list('ul', depth, v[1]);
      if (listItem) this.clear(listItem);
    });

    const orderedListValues = this.find(/^\s*\d\.\s(.*\n*)/gm);
    orderedListValues?.forEach((v) => {
      const depth = v[0].indexOf('.') - 1;
      const listItem = this.list('ol', depth, v[1]);
      if (listItem) this.clear(listItem);
    });

    const horizontalRuleValues = this.find(/---/g);
    horizontalRuleValues?.forEach(() => {
      const hr = document.createElement('hr');
      this.target?.replaceWith(hr);
    });

    const boldValues = this.find(/\*\*(.+?)\*\*/g);
    boldValues?.forEach((v) => this.change(v, 'strong', {}));

    const italicValues = this.find(/\*(.+?)\*/g);
    italicValues?.forEach((v) => this.change(v, 'em', {}, v[1].startsWith('*')));

    const strokeValues = this.find(/~~(.+?)~~/g);
    strokeValues?.forEach((v) => this.change(v, 's', {}));

    const escapedCodeValues = this.find(/``\s(.+?)\s``/g);
    escapedCodeValues?.forEach((v) =>
      this.change(v, 'code', {}, v.input?.startsWith('```'))
    );

    if (escapedCodeValues) this.clear(this.target);

    const codeValues = this.find(/`(.+?)`/g);
    codeValues?.forEach((v) => this.change(v, 'code', {}, v.input?.startsWith('```')));

    const markValues = this.find(/==(.+?)==/g);
    markValues?.forEach((v) => this.change(v, 'mark', {}));

    const imageValues = this.find(
      /^!\[(.*?)\]\(([^\s]+?)(?:\s=(\d+%?|auto)x(\d+%?|auto))?\)/g
    );
    imageValues?.forEach((v) =>
      this.change(v, 'img', {
        src: v[2].replaceAll('&amp;', '&'),
        alt: v[1] ?? 'image',
        width: v[3] ?? '100%',
        height: v[4] ?? '100%',
      })
    );

    const linkValues = this.find(/\[(.*?)\]\((.+?)\)/g);
    linkValues?.forEach((v) =>
      this.change(
        v,
        'a',
        {
          href: v[2],
          target: '_blank',
        },
        v.input?.startsWith('!')
      )
    );
  }

  tab(event: Event) {
    event.preventDefault();

    const { node } = getCursor();

    if (node?.nodeName === 'LI') {
      const prev = node.previousSibling;
      if (!prev) return;

      if (node instanceof HTMLElement)
        node.remove();

      const ul = this.create('ul');
      const li = this.create('li');
      ul.appendChild(li);

      prev.appendChild(ul);

      this.focus(li);
    }
  }

  change(
    match: RegExpMatchArray,
    name: string,
    props?: { [key: string]: string },
    exception?: boolean
  ) {
    if (!this.target || exception) return;

    const element = this.create(name, htmlCharToEntity(match[1]), props);

    // by Typing
    if (this.isTyping) {
      const { node, offset } = getCursor();

      if (!offset) return;

      const text = node?.textContent ?? '';
      const childNodes = Array.from(this.target.childNodes.values());
      const index = childNodes.findIndex((v) => v === node);

      const prevNodes = childNodes.filter((v, i) => i < index);
      const splitText = document.createTextNode(
        text.substring(0, offset - match[0].length)
      );
      const nextNodes = [
        document.createTextNode(text.substring(offset) || ZERO_WIDTH_SPACE),
        ...childNodes.filter((v, i) => i > index),
      ];

      this.target.replaceChildren(...prevNodes, splitText, element, ...nextNodes);
      this.focus(nextNodes[0], Number(nextNodes[0].textContent === ZERO_WIDTH_SPACE));
    }
    // by Loading
    else {
      this.target.innerHTML = this.target.innerHTML.replace(match[0], element.outerHTML);
    }
  }

  list(name: string, depth: number, content: string) {
    if (!this.target) return;

    const prev = this.target.previousElementSibling;
    if (!prev) return;

    const hasPrevList = prev && ['UL', 'OL'].includes(prev.tagName);

    if (depth === 0) {
      // List #2, #3, ...
      if (hasPrevList) {
        const listItem = this.create('li', content);
        prev.append(listItem);
        this.target.remove();
        return listItem;
      }
      // List #1
      else {
        const listHeader = this.create(name);
        const listItem = this.create('li', content);
        listHeader.appendChild(listItem);
        this.target.replaceWith(listHeader);
        return listItem;
      }
    } else {
      const appendedTarget = findParentList(prev, depth / 2);
      if (!appendedTarget) return;

      const nestedListHeader = Array.from(appendedTarget.childNodes).find((v) =>
        ['UL', 'OL'].includes(v.nodeName)
      );
      const listItem = this.create('li', content);

      // Nested List #2, #3, ...
      if (nestedListHeader) {
        nestedListHeader.appendChild(listItem);
      }
      // Nested List #1
      else {
        const listHeader = this.create(name);
        listHeader.appendChild(listItem);
        appendedTarget.appendChild(listHeader);
      }

      this.target.remove();
      return listItem;
    }
  }

  convertMarkdownToHtml(args: string, dest: HTMLElement) {
    const array = [];
    let freeze = false,
      text = '';

    const paragraphs = args
      .replaceAll('\r', '')
      .split('\n')
      .map((v) => htmlCharToEntity(v));

    for (const item of paragraphs) {
      const isCodeblock = item.includes('```');
      const isRawHtml = item.match(/<\/?(table|figure)(\sstyle=".*")?>/g);
      if (isCodeblock || isRawHtml) {
        freeze = !freeze;
        text += item + '\n';

        if (!freeze) {
          array.push(text);
          text = '';
        }

        continue;
      }

      if (freeze) text += item + '\n';
      else array.push(item);
    }

    const parser = new DOMParser();
    array.forEach((v) => {
      const parsed = parser.parseFromString(v, 'text/html');
      const element = parsed.body.firstElementChild ?? this.create('p', v);
      dest.appendChild(element);
      this.input(element);
    });
  }

  convertHtmlToMarkdown(args: HTMLElement) {
    const array = [];

    for (const element of args.children) {
      const tag = element.tagName;

      // root header
      if (tag === 'HEADER') {
        continue;
      }

      // horizontal line
      else if (tag === 'HR') {
        array.push('---');
      }

      // header
      else if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(tag)) {
        const size = '#'.repeat(Number(tag.charAt(1)));
        const text = htmlEntityToCharExtension(element.innerHTML);
        array.push(`${size} ${text}`);
      }

      // blockquote
      else if (tag === 'BLOCKQUOTE') {
        const temp: string[] = [];
        findNestedBlockquote(element, 0, temp);
        array.push(temp.join('\n'));
      }

      // codeblock
      else if (tag === 'PRE') {
        const tempArray = [];
        for (const [i, code] of Array.from(element.children).entries()) {
          const text = code?.textContent ?? '';
          code.classList.remove('hljs');
          if (i === 0)
            tempArray.push('```' + (code.classList.length > 0 ? code.classList[0] : ''));
          tempArray.push(text.endsWith('\n') ? text.slice(0, -1) : text);
        }
        tempArray.push('```');
        array.push(tempArray.join('\n'));
      }

      // list
      else if (['UL', 'OL'].includes(tag)) {
        const temp: string[] = [];
        findNestedList(element, 0, temp);
        array.push(temp.join('\n'));
      }

      // raw-html
      else if (['FIGURE', 'TABLE'].includes(tag)) {
        array.push(element.outerHTML);
      }

      // default
      else {
        const text = htmlEntityToCharExtension(element.innerHTML);
        array.push(text);
      }
    }

    return array.join('\n');
  }
}

const ZERO_WIDTH_SPACE = '\u200B';

function getCursor() {
  const selection = window.getSelection();
  const node = selection?.focusNode;
  const offset = selection?.focusOffset;

  return { selection, node, offset };
}

function htmlEntityToChar(html: string) {
  return html.replaceAll('&lt;', '<').replaceAll('&gt;', '>');
}

function htmlEntityToCharExtension(html: string) {
  return html
    .replaceAll('<br>', '')
    .replaceAll('\u200B', '')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&')
    .replaceAll(/<strong>(.+?)<\/strong>/g, '**$1**')
    .replaceAll(/<code>(.+?)<\/code>/g, '`$1`')
    .replaceAll(/<em>(.+?)<\/em>/g, '*$1*')
    .replaceAll(/<mark>(.+?)<\/mark>/g, '==$1==')
    .replaceAll(/<a href="(.+?)" target="_blank">(.+?)<\/a>/g, '[$2]($1)')
    .replaceAll(/<img src="(.+?)" alt="(.+?)">/g, '![$2]($1)')
    .replaceAll(/<s>(.+?)<\/s>/g, '~~$1~~');
}

function htmlCharToEntity(html: string) {
  return html.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function findParentList(parent: Element, iterate: number): Element | null {
  const child = parent.lastElementChild;
  const nestedElement = child?.lastElementChild;

  return nestedElement && iterate - 1 > 0
    ? findParentList(nestedElement, iterate - 1)
    : child;
}

function findNestedList(element: Element, depth: number, destination: string[]) {
  const hasNestedList = (node: Node) => ['UL', 'OL'].includes(node.nodeName);

  const items = element.childNodes;
  items.forEach((item, index) => {
    const spaceWidth = ' '.repeat(depth * 2);
    const listStyle = element.tagName === 'UL' ? '*' : `${index + 1}.`;

    const contents = Array.from(item.childNodes)
      .filter((v) => !hasNestedList(v))
      .map((v) =>
        v instanceof HTMLElement ? htmlEntityToCharExtension(v.outerHTML) : v.textContent
      );

    destination.push(spaceWidth + listStyle + ' ' + contents.join(''));

    const nestedList = Array.from(item.childNodes).find((v) => hasNestedList(v));
    if (nestedList && nestedList instanceof Element)
      findNestedList(nestedList, depth + 1, destination);
  });
}

function findNestedBlockquote(element: Element, depth: number, destination: string[]) {
  const items = element.children;
  Array.from(items).forEach((item) => {
    if (item.tagName === 'P') {
      const text = htmlCharToEntity(item.innerHTML);
      text.split('\n').forEach((t) => destination.push(`${'>'.repeat(depth + 1)} ${t}`));
    }

    if (item.tagName === 'BLOCKQUOTE') findNestedBlockquote(item, depth + 1, destination);
  });
}
