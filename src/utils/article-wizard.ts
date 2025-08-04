export default class ArticleWizard {
  root?: HTMLElement
  target?: HTMLElement | Element | null;
  text?: string;

  isTyping?: boolean;

  init(element: HTMLElement) {
    this.root = element;
  }

  create(name: string, value?: string, props?: { [key: string]: string }) {
    const el = document.createElement(name);
    el.innerHTML = value ?? '';
    // el[escaped ? 'textContent' : 'innerHTML'] = value ?? '';

    if (props) {
      Object.keys(props).forEach((key) => {
        el.setAttribute(key, props[key]);
      });
    }

    return el;
  }

  focus(node: Node, offset?: number) {
    const selection = window.getSelection();
    if (!selection) return;
    selection.removeAllRanges();

    const range = document.createRange();

    if (offset) {
      range.setStart(node, offset);
      range.setEnd(node, offset);
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


  clear(element?: Element | HTMLElement) {
    this.isTyping = Boolean(!element);

    if (element) {
      this.target = element;
      this.text = element.innerHTML;
    } else {
      const selection = window.getSelection();
      const node = selection?.focusNode;

      if (!node) return;

      this.target = (node.nodeType === Node.TEXT_NODE)
        ? node?.parentElement
        : node as HTMLElement;
      this.text = node?.textContent ?? '';
    }
  }

  input(el?: Element | HTMLElement) {
    this.clear(el);
    if (!this.target) return;

    console.log(el);

    const codeblockValues = this.find(/```(\w*)(\n?)(?:((?:.*\n)*)```)*/g);
    codeblockValues?.forEach((v) => {
      const code = (v[3] ?? '').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

      const parent = this.create('pre');
      const child = this.create('code', code);
      
      parent.append(child);
      this.target?.replaceWith(parent);

      if (v[1])
        parent?.firstElementChild?.classList.add(v[1]);
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

      if (prev?.tagName === 'BLOCKQUOTE') {
        prev.innerHTML = prev.innerHTML + '\n' + v[1];
        this.target?.remove();
      } else {
        const blockquote = this.create('blockquote', v[1]);
        this.target?.replaceWith(blockquote);
        this.clear(blockquote);
      }
    });

    const unorderedListValues = this.find(/^\s*\*\s(.*\n*)/gm);
    unorderedListValues?.forEach((v, i) => {
      const depth = v[0].indexOf('*');
      const listItem = this.list('ul', depth, v[1]);
      this.clear(listItem);
    });

    const orderedListValues = this.find(/^\s*\d\.\s(.*\n*)/gm);
    orderedListValues?.forEach((v) => {
      const depth = v[0].indexOf('.') - 1;
      const listItem = this.list('ol', depth, v[1]);
      this.clear(listItem);
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

    const escapedCodeValues = this.find(/``\s(.+?)\s``/g);
    escapedCodeValues?.forEach((v) => this.change(v, 'code', {}, v.input?.startsWith('```')));

    if (escapedCodeValues)
      this.clear(this.target);

    // const codeValues = this.find(/`([^`\s].+?[^`\s])`/g);
    const codeValues = this.find(/`(.+?)`/g);
    codeValues?.forEach((v) => this.change(v, 'code', {}, v.input?.startsWith('```')));
    

    // const codeValues = this.find(/`([^!</code>].+?)`/g);


    const markValues = this.find(/==(.+?)==/g);
    markValues?.forEach((v) => this.change(v, 'mark', {}));

    // const imageValues = this.find(/^!\[(.*?)\]\((.+?)\)/g);
    const imageValues = this.find(/^!\[(.*?)\]\(([^\s]+?)(?:\s=(\d+%?|auto)x(\d+%?|auto))?\)/g);
    imageValues?.forEach((v) => this.change(v, 'img', {
      src: v[2].replaceAll('&amp;', '&'),
      alt: v[1] ?? 'image',
      width: v[3] ?? '100%',
      height: v[4] ?? '100%'
    }));

    const linkValues = this.find(/\[(.*?)\]\((.+?)\)/g);
    linkValues?.forEach((v) => this.change(v, 'a', {
      href: v[2],
      target: '_blank'
    }, v.input?.startsWith('!')));
  }

  enter() {
    const selection = window.getSelection();
    const node = selection?.focusNode;

    if (!node) return;

    if (['DIV', 'H6'].includes(node.nodeName))
      this.target?.replaceWith(this.create('p'));
  }

  tab(event: VEvent<HTMLElement>) {
    event.preventDefault();

    const { node } = getCursor();

    if (node?.nodeName === 'LI') {
      const prev = (node as HTMLElement).previousElementSibling;
      if (!prev) return;

      (node as HTMLElement).remove();

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

      const prevNodes = childNodes.filter((v, i) => i < index).map((v) => v as Node);
      const splitText = document.createTextNode(text.substring(0, offset - match[0].length));
      const nextNodes = [
        document.createTextNode(text.substring(offset) || ZERO_WIDTH_SPACE),
        ...childNodes.filter((v, i) => i > index).map((v) => v as Node)
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
    // (name, depth, content, this.target);
    if (!this.target) return;

    const prev = this.target.previousElementSibling;
    if (!prev) return;

    const hasPrevList = prev && ['UL', 'OL'].includes(prev.tagName);

    // console.log(hasPrevList);

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
    }
    else {
      const appendedTarget = listIterator(prev, depth / 2);
      if (!appendedTarget) return;

      const nestedListHeader = Array.from(appendedTarget.childNodes).find((v) => ['UL', 'OL'].includes(v.nodeName));
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

  convertMarkdownToHtml(args: string, destination: HTMLElement): void {
    const array: Array<string> = [];
    let freeze = false, text = '';

    const paragraphs = args.replaceAll('\r', '').split('\n').map((v) => htmlCharToEntity(v));
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

      if (freeze)
        text += item + '\n';
      else
        array.push(item);
    }

    const parser = new DOMParser();
    array.forEach((v) => {
      const parsed = parser.parseFromString(v, 'text/html');
      const element = parsed.body.firstElementChild ?? this.create('p', v);
      destination.appendChild(element);
      this.input(element);

      // console.log(parsed.body.childElementCount);
      // const element = document.createElement('P');
      // element.innerHTML = v;
    })
  }

  convertHtmlToMarkdown(args: HTMLElement) {
    const array: Array<string> = [];

    for (const element of args.children) {
      const tag = element.tagName;

      // if (!element.innerHTML)
      //   continue;
      
      // root header
      if (tag === 'HEADER') {
        continue;
      }

      // header
      else if (element.tagName.startsWith('H')) {
        const size = '#'.repeat(Number(tag.charAt(1)));
        const text = htmlEntityToCharExtension(element.innerHTML);
        array.push(`${size} ${text}`);
      }

      // blockquote
      else if (tag === 'BLOCKQUOTE') {
        const text = htmlEntityToCharExtension(element.innerHTML);
        text.split('\n').forEach((t) => array.push(`> ${t}`));
      }

      // codeblock
      else if (tag === 'PRE') {
        const tempArray = [];
        for (const [i, code] of Array.from(element.children).entries()) {
          const text = code?.textContent ?? '';
          code.classList.remove('hljs');
          if (i === 0)
            tempArray.push('```' + (code.classList.length > 0 ? code.classList[0] : ''));
          tempArray.push(text.endsWith('\n') ? text.slice(0, -1) : text)
        }
        tempArray.push('```');
        array.push(tempArray.join('\n'));
      }

      // list
      else if (['UL', 'OL'].includes(tag)) {
        const tempArray: Array<string> = [];
        
        const hasNestedList = (n: Node) => ['UL', 'OL'].includes(n.nodeName);

        const findNestedList = (e: Element, depth: number) => {
          const items = e.childNodes;
          items.forEach((item, index) => {
            const spaceWidth = ' '.repeat(depth * 2);
            const listStyle = e.tagName === 'UL' ? '*' : `${index + 1}.`

            const contents = Array.from(item.childNodes)
              .filter((v) => !hasNestedList(v))
              .map((v) => v.nodeType === Node.TEXT_NODE
                ? v.textContent
                : htmlEntityToCharExtension((v as Element).outerHTML)
              );
            tempArray.push(spaceWidth + listStyle + ' ' + contents.join(''));

            const nestedList = Array.from(item.childNodes).find((v) => hasNestedList(v));
            if (nestedList)
              findNestedList(nestedList as Element, depth + 1);
          });
        };

        findNestedList(element, 0);
        array.push(tempArray.join('\n'));
      }

      // raw-html
      else if (['FIGURE', 'TABLE'].includes(tag)) {
        console.log('>>>>', element);
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
  return html
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
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
    .replaceAll(/<img src="(.+?)" alt="(.+?)">/g, '![$2]($1)');
}

function htmlCharToEntity(html: string) {
  return html
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function listIterator(parent: Element, iterate: number): Element | null {
  const child = parent.lastElementChild;
  const nestedElement = child?.lastElementChild;
  return (nestedElement && iterate - 1 > 0)
    ? listIterator(nestedElement, iterate - 1)
    : child;
}

interface VEvent<T extends EventTarget> extends Event {
  target: T;
}