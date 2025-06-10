import { ref, Ref } from 'vue';

interface VEvent<T extends EventTarget> extends Event {
  target: T;
}

export function useArticle() {
  const root: Ref<HTMLElement | undefined> = ref();

  function init(args: HTMLElement) {
    root.value = args;
  }

  function focus(target: Node) {
    const selection = window.getSelection();
    selection?.removeAllRanges();
    const range = document.createRange();
    range.selectNodeContents(target);
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

  function getTarget(args?: HTMLElement) {
    if (args) return args;

    const selection = window.getSelection();
    const focusNode = selection?.focusNode;
    if (!focusNode) return null;

    return (focusNode.nodeType === Node.TEXT_NODE)
      ? focusNode.parentElement
      : focusNode as HTMLElement;
  }
  
  function input(args?: HTMLElement, event?: InputEvent) {
    const target = getTarget(args);
    if (!target) return;

    // Do nothing if this event is invoked in codeblock
    if (target?.tagName.match(/PRE|CODE/g)) return;
    if (target?.parentElement?.tagName.match(/CODE/g)) return;

    if (event?.inputType === 'insertText') {
      target.innerHTML = target.innerHTML.replaceAll('\u200B', '');
      focus(target);  
    }

    const find = (regexp: RegExp) => {
      const matched = Array.from(target.innerHTML.matchAll(regexp));
      return matched.length > 0 ? matched : null;
    };

    const change = (v: RegExpMatchArray, to: string, exception?: boolean) => {
      if (exception) return;

      const zwsb = (event?.inputType === 'insertText') ? '\u200B' : '';
      const html = (['strong', 'em', 'code', 'mark'].includes(to))
        ? `<${to}>${v[1]}</${to}>${zwsb}`
        : to;
      
      target.innerHTML = target.innerHTML.replace(v[0], html);
      focus(target);
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
    const italicValues = find(/\*(.+?)\*/g);
    const codeValues = find(/`(.+?)`/g);
    const markValues = find(/==(.+?)==/g);
    const linkValues = find(/\[(.*?)\]\((.+?)\)/g);

    boldValues?.forEach((v) => change(v, 'strong'));
    italicValues?.forEach((v) => change(v, 'em', v[1].startsWith('*')));
    codeValues?.forEach((v) => change(v, 'code', v.input?.startsWith('```')));
    markValues?.forEach((v) => change(v, 'mark'));
    linkValues?.forEach((v) => change(v, `<a href="${v[2]}" target="_blank">${v[1]}</a>`));
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