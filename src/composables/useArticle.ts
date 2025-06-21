import { ref, Ref } from 'vue';

interface VEvent<T extends EventTarget> extends Event {
  target: T;
}

export function useArticle() {
  const root: Ref<HTMLElement | undefined> = ref();

  function init(args: HTMLElement) {
    root.value = args;
  }

  function focus(target: Node, offset?: number) {
    const selection = window.getSelection();
    selection?.removeAllRanges();
    const range = document.createRange();
    if (offset) {
      range.setStart(target, offset);
      range.setEnd(target, offset);  
    } else {
      range.selectNodeContents(target);
    }
    range.collapse(false);
    selection?.addRange(range);
  }

  function tab(event: VEvent<HTMLElement>) {
    event.preventDefault();

    const selection = window.getSelection();

    if (selection?.focusNode?.nodeName === 'LI') {
      const target = selection?.focusNode as HTMLElement;
      const prev = target.previousElementSibling;
      if (!prev) return;
      target.remove();
      const ul = document.createElement('ul');
      const li = document.createElement('li');
      ul.appendChild(li);
      prev.appendChild(ul);

      focus(li);
    }
  }

  function enter() {
    const selection = window.getSelection();
    if (!selection?.focusNode) return;

    const target = selection.focusNode as HTMLElement;
    if (target.tagName == 'DIV') target.replaceWith(document.createElement('p'));
  }

  function getTarget(args?: HTMLElement, node?: Node | null): HTMLElement | undefined {
    if (args)
      return args;

    if (!node)
      return;

    if (node.nodeType === Node.TEXT_NODE)
      return node.parentElement ?? undefined;
    else
      return node as HTMLElement;
  }

  function input(args?: HTMLElement) {
    const selection = window.getSelection();
    const node = selection?.focusNode;
    const offset = selection?.focusOffset;

    const target: HTMLElement | undefined = getTarget(args, node);
    if (!target) return;

    // Do nothing if this event is invoked in codeblock
    if (target?.tagName.match(/PRE|CODE/g)) return;
    if (target?.parentElement?.tagName.match(/CODE/g)) return;

    const find = (regexp: RegExp) => {
      const text = args ? args.innerHTML : (node?.textContent ?? '');
      const matched = Array.from(text.matchAll(regexp));
      return matched.length > 0 ? matched : null;
    };

    const change = (
      match: RegExpMatchArray,
      name: string,
      props?: { [key: string]: string },
      exception?: boolean
    ) => {
      if (exception) return;

      const element = document.createElement(name);
      element.innerHTML = match[1];
      if (props) {
        Object.keys(props).forEach((key: string) => {
          element.setAttribute(key, props[key]);
        });
      }

      if (args) {
        args.innerHTML = args.innerHTML.replace(match[0], element.outerHTML);
      } else if (offset) {
        const text = node?.textContent ?? '';
        const childNodes = Array.from(target.childNodes.values());
        const index = childNodes.findIndex((v) => v === node);
  
        const prevNodes = childNodes.filter((v, i) => i < index).map((v) => v as Node);
        const splitText = document.createTextNode(text.substring(0, offset - match[0].length));
        const nextNodes = [
          document.createTextNode(text.substring(offset) || '\u200B'),
          ...childNodes.filter((v, i) => i > index).map((v) => v as Node)
        ];
  
        target.replaceChildren(...prevNodes, splitText, element, ...nextNodes);
        focus(nextNodes[0], Number(nextNodes[0].textContent === '\u200B'));
      } else {
        return;
      }
    }

    // Block level element
    const codeblockValues = find(/```(\w*)(\n?)(?:((?:.*\n)*)```)*/g);
    const headerValues = find(/^#{1,6}\s(.*)$/g);
    const blockquoteValues = find(/^&gt;\s(.*)/g);
    const unorderedListValues = find(/^\s*\*\s(.*\n*)/gm);
    const orderedListValues = find(/^\s*\d\.\s(.*\n*)/gm);

    if (codeblockValues) {
      codeblockValues.forEach((v) => {
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        pre.appendChild(code);
        target.replaceWith(pre);
        code.focus();

        if (v[1]) code.classList.add(v[1]);
        if (v[3]) code.innerHTML = replaceToHtmlEntity(v[3]);
      });
      return;
    } else if (headerValues) {
      headerValues.forEach((v) => {
        const size = (v[0].match(/#/g) ?? []).length;
        const header = document.createElement(`h${size}`);
        target.replaceWith(header);
        header.focus();

        if (v[1]) {
          header.innerHTML = v[1];
          input(header);
        }
      });
      return;
    } else if (blockquoteValues) {
      blockquoteValues.forEach((v) => {
        const blockquote = document.createElement('blockquote');
        target.replaceWith(blockquote);
        blockquote.focus();

        if (v[1]) {
          blockquote.innerHTML = v[1];
          input(blockquote);
        }
      });
      return;
    } else if (unorderedListValues) {
      let ul: HTMLElement | null = null;
      unorderedListValues.forEach((v, i) => {
        const isFirstList = i === 0;

        if (isFirstList) {
          ul = document.createElement('ul');
          target.replaceWith(ul);
        }

        if (!ul) return;
        const li = document.createElement('li');
        ul.appendChild(li);

        if (v[1]) {
          li.innerHTML = v[1];
          input(li);
        }
      });
      return;
    } else if (orderedListValues) {
      let ol: HTMLElement | null = null;
      orderedListValues.forEach((v, i) => {
        const isFirstList = i === 0;

        if (isFirstList) {
          ol = document.createElement('ol');
          target.replaceWith(ol);
        }

        if (!ol) return;
        const li = document.createElement('li');
        ol.appendChild(li);

        if (v[1]) {
          li.innerHTML = v[1];
          input(li);
        }
      });
      return;
    }

    // Inline level element
    const boldValues = find(/\*\*(.+?)\*\*/g);
    boldValues?.forEach((v) => change(v, 'strong', {}));

    const italicValues = find(/\*(.+?)\*/g);
    italicValues?.forEach((v) => change(v, 'em', {}, v[1].startsWith('*')));

    const codeValues = find(/`(.+?)`/g);
    codeValues?.forEach((v) => change(v, 'code', {}, v.input?.startsWith('```')));

    const markValues = find(/==(.+?)==/g);
    markValues?.forEach((v) => change(v, 'mark', {}));

    const linkValues = find(/\[(.*?)\]\((.+?)\)/g);
    linkValues?.forEach((v) => change(v, 'a', { href: v[2], target: '_blank' }));
  }

  async function paste(args: Event) {
    const event = args as VEvent<HTMLElement>;
    event.preventDefault();

    const clipboardContents = await navigator.clipboard.read();
    const blob = await clipboardContents[0].getType('text/plain');
    const blobText = await blob.text();

    const selection = window.getSelection();
    const offset = selection?.focusOffset ?? 0;

    const target = selection?.focusNode;
    if (!target) return;

    const originalText = target.textContent;
    target.textContent =
      originalText?.substring(0, offset) + blobText + originalText?.substring(offset);
  }

  function convertToHtml(args: string) {
    const items = args.replaceAll('\r\n', '\n').split('\n');

    const block: {
      type: 'CODE_BLOCK' | 'UNORDERED_LIST' | 'ORDERED_LIST' | undefined;
      html: string;
    } = { type: undefined, html: '' };

    const append = (str: string) => {
      if (!root.value) return;
      const p = document.createElement('p');
      p.innerHTML = str;
      root.value.append(p);
      input(p);
    };

    for (const item of items) {
      const html = replaceToHtmlEntity(item);

      // CodeBlock
      if (html.match(/```\w*/g)) {
        block.type = !block.type ? 'CODE_BLOCK' : undefined;
        block.html += html + '\n';

        if (!block.type) {
          append(block.html);
          block.html = '';
        }
      }
      // Unordered List
      else if (html.match(/^\s*\*\s(.*\n*)/g)) {
        if (block.type === 'CODE_BLOCK') continue;
        block.type = 'UNORDERED_LIST';
        block.html += html + '\n';
      }
      // Ordered List
      else if (html.match(/^\s*\d\.\s(.*\n*)/g)) {
        if (block.type === 'CODE_BLOCK') continue;
        block.type = 'ORDERED_LIST';
        block.html += html + '\n';
      }
      // Paragraph
      else {
        if (block.type === 'CODE_BLOCK') {
          block.html += html + '\n';
          continue;
        }

        if (block.type === 'UNORDERED_LIST' || block.type === 'ORDERED_LIST') {
          block.type = undefined;
          append(block.html);
          block.html = '';
        }

        append(html);
      }
    }
  }

  function convertToMarkdown(args: HTMLElement) {
    let markdown = '';

    const elements = args.children;
    for (const element of elements) {
      const html = replaceToHtmlCharacter(element.innerHTML);
      const tagName = element.tagName;

      // Title
      if (tagName === 'HEADER') {
        continue;
      }
      // Header
      else if (tagName.startsWith('H')) {
        const size = Number(tagName.charAt(1));
        for (let i = 0; i < size; i++) markdown += '#';
        markdown += ` ${html}`;
      }
      // Blockquote
      else if (tagName === 'BLOCKQUOTE') {
        markdown += `> ${html}`;
      }
      // Codeblock
      else if (tagName === 'PRE') {
        markdown += '```';
        Array.from(element.children).forEach((code, index) => {
          code.classList.remove('hljs');
          if (index === 0)
            markdown += (code.classList.length > 0 ? code.classList[0] : '') + '\n';
          const codeContents = code.textContent;
          const lineBreak = codeContents?.endsWith('\n') ? '' : '\n';
          markdown += codeContents + lineBreak;
        });
        markdown += '```';
      }
      // Unordered-List
      else if (tagName === 'UL') {
        Array.from(element.children).forEach((list) => {
          const listContents = replaceToHtmlCharacter(
            (list as HTMLElement).innerHTML
          ).replaceAll('\n', '');
          markdown += `* ${listContents}\n`;
        });
      }
      // Ordered-List
      else if (tagName === 'OL') {
        Array.from(element.children).forEach((list, index) => {
          const listContents = replaceToHtmlCharacter(
            (list as HTMLElement).innerHTML
          ).replaceAll('\n', '');
          markdown += `${index + 1}. ${listContents}\n`;
        });
      }
      // Others
      else markdown += html;

      // Line Break
      markdown += ['UL', 'OL'].includes(tagName) ? '' : '\n';
    }

    return markdown;
  }

  function replaceToHtmlCharacter(s: string) {
    return s
      .replaceAll('\u200B', '')
      .replaceAll('<br>', '')
      .replaceAll(/<strong>(.+?)<\/strong>/g, '**$1**')
      .replaceAll(/<code>(.+?)<\/code>/g, '`$1`')
      .replaceAll(/<em>(.+?)<\/em>/g, '*$1*')
      .replaceAll(/<mark>(.+?)<\/mark>/g, '==$1==')
      .replaceAll(/<a href="(.+?)" target="_blank">(.+?)<\/a>/g, '[$2]($1)')
      .replaceAll('&gt;', '>')
      .replaceAll('&lt;', '<')
      .replaceAll('&amp;', '&');
  }

  function replaceToHtmlEntity(s: string) {
    return s
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }

  return {
    init,
    input,
    enter,
    paste,
    tab,
    convertToHtml,
    convertToMarkdown,
  };
}