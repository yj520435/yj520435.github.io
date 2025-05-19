import { ref, Ref } from 'vue';

interface VEvent<T extends EventTarget> extends Event {
  target: T;
}

export function useArticle() {
  const root: Ref<HTMLElement | undefined> = ref();

  function init(args: HTMLElement) {
    root.value = args;

    // const p = root.value.lastElementChild;
    // if (p) {
    // (p as HTMLElement).focus();
    // }
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

  function enter(event: VEvent<HTMLElement>) {
    event.preventDefault();

    const selection = window.getSelection();
    if (!selection?.focusNode) return;

    const target = selection.focusNode?.parentElement as HTMLElement;

    if (target.tagName === 'LI') {
      if (target.innerText === '') {
        // Do Something
      } else {
        const ul = target.parentElement;
        const li = document.createElement('li');
        ul?.appendChild(li);
        focus(li);
        return;
      }
    }

    const p = document.createElement('p');
    root.value?.appendChild(p);
    focus(p);
  }

  function input(args?: HTMLElement, isDomEditing?: boolean) {
    const selection = window.getSelection();
    const target = args ?? selection?.focusNode?.parentElement;
    if (!target) return;

    const space = isDomEditing ? ' ' : '';

    // Bold
    Array.from(target.innerHTML.matchAll(/\*\*(.+?)\*\*/g)).forEach((v) => {
      target.innerHTML = target.innerHTML.replace(
        v[0],
        `<strong>${v[1]}</strong>${space}`
      );
      focus(target);
    });

    // Italic
    Array.from(target.innerHTML.matchAll(/\*(.+?)\*/g)).forEach((v) => {
      if (!v[1].startsWith('*')) {
        target.innerHTML = target.innerHTML.replace(v[0], `<em>${v[1]}</em>${space}`);
        focus(target);
      }
    });

    // Inline Code
    Array.from(target.innerHTML.matchAll(/`(.+?)`/g)).forEach((v) => {
      if (!v.input?.startsWith('```')) {
        target.innerHTML = target.innerHTML.replace(v[0], `<code>${v[1]}</code>${space}`);
        focus(target);
      }
    });

    // Link
    Array.from(target.innerHTML.matchAll(/\[(.*?)\]\((.*?)\s?(?:"(.*?)")?\)/g)).forEach(
      (v) => {
        target.innerHTML = target.innerHTML.replace(
          v[0],
          `<a href="${v[2]}" target="_blank">${v[1]}</a>`
        );
        focus(target);
      }
    );

    // Header
    Array.from(target.innerHTML.matchAll(/^#{1,6}\s(.*)$/g)).forEach((v) => {
      const size = (v[0].match(/#/g) || []).length;
      const header = document.createElement(`h${size}`);
      target.replaceWith(header);
      header.focus();

      if (v[1]) {
        header.innerHTML = v[1];
        input(header);
      }
    });

    // Blockquote
    Array.from(target.innerHTML.matchAll(/^&gt;\s(.*)/g)).forEach((v) => {
      const blockquote = document.createElement('blockquote');
      target.replaceWith(blockquote);
      blockquote.focus();

      if (v[1]) {
        blockquote.innerHTML = v[1];
        input(blockquote);
      }
    });

    // CodeBlock
    Array.from(target.innerHTML.matchAll(/```(\w*\n)?(?:((?:.*\n)*)```)*/g)).forEach(
      (v) => {
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        pre.appendChild(code);
        target.replaceWith(pre);
        code.focus();

        if (v[2]) code.innerHTML = getHtmlEscape(v[2]);
      }
    );

    // List
    Array.from(target.innerHTML.matchAll(/^\s*\*\s(.*\n*)/gm)).forEach((v, i) => {
      const isFirstList = i === 0;
      const ul = isFirstList
        ? document.createElement('ul')
        : root.value?.lastElementChild;
      if (!ul) return;

      const li = document.createElement('li');
      ul.appendChild(li);

      if (isFirstList) {
        target.replaceWith(ul);
      }

      if (v[1]) {
        li.innerHTML = v[1];
        input(li);
      }
    });
  }

  async function paste(args: Event) {
    const event = args as VEvent<HTMLElement>;
    event.preventDefault();

    if (!root.value) return;

    const firstElement = root.value.firstElementChild;
    if (firstElement && firstElement.textContent === '') firstElement.remove();

    const clipboardContents = await navigator.clipboard.read();
    const blob = await clipboardContents[0].getType('text/plain');
    const blobText = await blob.text();

    convertToHtml(blobText);
  }

  function convertToHtml(args: string) {
    const items = args.replaceAll('\r\n', '\n').split('\n');

    const codeblock = { active: false, html: '' };
    const list = { active: false, html: '' };

    const append = (args: string) => {
      if (!root.value) return;
      const p = document.createElement('p');
      p.innerHTML = args;
      root.value.append(p);
      input(p);
    };

    for (const item of items) {
      const html = getHtmlEscape(item);

      const isList = html.match(/^\s*\*\s(.*\n*)/g);

      if (isList) {
        list.active = true;
        list.html += html + '\n';
        continue;
      }

      if (list.active && !isList) {
        list.active = false;
        append(list.html);
        list.html = '';
      }

      const isCodeBlock = html.match(/```\w*/g);

      if (isCodeBlock) {
        codeblock.html += html + '\n';
        codeblock.active = !codeblock.active;

        if (!codeblock.active) {
          append(codeblock.html);
          codeblock.html = '';
        }
        continue;
      }

      if (codeblock.active && !isCodeBlock) {
        codeblock.html += html + '\n';
        continue;
      }

      append(html);
    }
  }

  function convertToMarkdown(args: HTMLElement) {
    let markdown = '';

    const elements = args.children;
    for (const element of elements) {
      const html = element.innerHTML;
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
        const code = element.childNodes.item(0);
        markdown += `\`\`\`\n${(code as HTMLElement).innerText}\`\`\``;
      }
      // List
      else if (tagName === 'UL') {
        const items = Array.from(element.children);
        for (const item of items) {
          markdown += `* ${(item as HTMLElement).innerHTML}`;
        }
      }
      // Others
      else markdown += html;

      // Inline Tag
      markdown = markdown
        .replaceAll(/<strong>(.+?)<\/strong>/g, '**$1**')
        .replaceAll(/<code>(.+?)<\/code>/g, '`$1`')
        .replaceAll(/<em>(.+?)<\/em>/g, '*$1*')
        .replaceAll(/<a href="(.+?)".*>(.+?)<\/a>/g, '[$2]($1)')
        .replaceAll('&gt;', '>')
        .replaceAll('&lt;', '<');

      // if (tagName === 'UL')
      markdown += tagName !== 'UL' ? '\n' : '';
    }

    return markdown;
  }

  function getHtmlEscape(s: string) {
    return s.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  }

  // function focusToEnd(element: HTMLElement) {
  //   if (element.innerText.length === 0) {
  //     element.focus();
  //     return;
  //   }

  //   const selection = window.getSelection();
  //   const newRange = document.createRange();
  //   newRange.selectNodeContents(element);
  //   newRange.collapse(false);
  //   selection?.removeAllRanges();
  //   selection?.addRange(newRange);
  // }

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
