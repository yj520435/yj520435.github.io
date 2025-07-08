import InputManager from '@/utils/input-manager';
import { ref, Ref } from 'vue';

interface VEvent<T extends EventTarget> extends Event {
  target: T;
}

const inputManager = new InputManager();
const { focus, clear, find, replace, change, list } = inputManager;

export function useArticle() {
  const root: Ref<HTMLElement | undefined> = ref();

  function init(args: HTMLElement) {
    root.value = args;
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
    const target = selection?.focusNode;

    if (!target) return;

    if (['DIV', 'H6'].includes(target.nodeName))
      (target as HTMLElement).replaceWith(document.createElement('p'));
  }

  function input(args?: HTMLElement, event?: InputEvent) {
    clear(args);
    const target = inputManager.target;

    // Do nothing if this event is invoked in codeblock
    if (target?.tagName.match(/PRE|CODE/g)) return;
    if (target?.parentElement?.tagName.match(/CODE/g)) return;

    const codeblockValues = find(/```(\w*)(\n?)(?:((?:.*\n)*)```)*/g);
    const headerValues = find(/^#{1,6}\s(.*)$/g);
    const blockquoteValues = find(/^(?:>|&gt;)\s(.*)/g);
    const unorderedListValues = find(/^\s*\*\s(.*\n*)/gm);
    const orderedListValues = find(/^\s*\d\.\s(.*\n*)/gm);

    if (codeblockValues) {
      codeblockValues.forEach((v) => {
        const code = (v[3] ?? '').replaceAll('<', '&lt').replaceAll('>', '&gt;');
        const codeblock = replace('pre', code);
        if (v[1]) codeblock?.firstElementChild?.classList.add(v[1]);
      });
      return;
    }
    
    if (headerValues) {
      headerValues.forEach((v) => {
        const size = (v[0].match(/#/g) ?? []).length;
        const h = replace(`h${size}`, v[1]);
        input(h);
      });
      return;
    }
    
    if (blockquoteValues) {
      blockquoteValues.forEach((v) => {
        const blockquote = replace('blockquote', v[1]);
        input(blockquote);
      });
      return;
    }

    if (unorderedListValues) {
      unorderedListValues.forEach((v) => {
        const depth = v[0].indexOf('*');
        const li = list('ul', depth, v[1]);
        if (li) input(li);
      });
      return;
    }

    if (orderedListValues) {
      orderedListValues.forEach((v) => {
        const depth = v[0].indexOf('.') - 1;
        const li = list('ol', depth, v[1]);
        if (li) input(li);
      });
      return;
    }

    const boldValues = find(/\*\*(.+?)\*\*/g);
    boldValues?.forEach((v) => change(v, 'strong', {}));

    const italicValues = find(/\*(.+?)\*/g);
    italicValues?.forEach((v) => change(v, 'em', {}, v[1].startsWith('*')));

    const codeValues = find(/`(.+?)`/g);
    codeValues?.forEach((v) => change(v, 'code', {}, v.input?.startsWith('```')));

    const markValues = find(/==(.+?)==/g);
    markValues?.forEach((v) => change(v, 'mark', {}));

    const imageValues = find(/^!\[(.*?)\]\((.+?)\)/g);
    imageValues?.forEach((v) => change(v, 'img', { src: v[2].replaceAll('&amp;', '&') , alt: v[1] ?? 'image' }));

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

    const codeblock: {
      isActive: boolean, html: string
    } = { isActive: false, html: '' };

    const append = (str: string) => {
      if (!root.value) return;
      const p = document.createElement('p');
      p.innerHTML = str;
      root.value.append(p);
      input(p);
    }

    for (const item of items) {
      // const html = [...htmlCharacterEntityMap.keys()].reduce(
      //   (acc, v) => acc.replaceAll(htmlCharacterEntityMap.get(v), v),
      //   item
      // );

      const html = item.replaceAll('<', '&lt;').replaceAll('>', '&gt;');

      if (html.match(/```\w*/g)) {
        codeblock.isActive = !codeblock.isActive;
        codeblock.html += html + '\n';

        if (!codeblock.isActive) {
          append(codeblock.html);
          codeblock.html = '';
        }
      } else {
        if (codeblock.isActive) {
          codeblock.html += html + '\n';
          continue;
        }
  
        append(html);
      }
    }
  }

  function convertToMarkdown(args: HTMLElement) {
    const markdown = new Array<string>();

    const $ = (str: string) => {
      return str
        .replaceAll('<br>', '')
        .replaceAll('\u200B', '')
        .replaceAll(/<strong>(.+?)<\/strong>/g, '**$1**')
        .replaceAll(/<code>(.+?)<\/code>/g, '`$1`')
        .replaceAll(/<em>(.+?)<\/em>/g, '*$1*')
        .replaceAll(/<mark>(.+?)<\/mark>/g, '==$1==')
        .replaceAll(/<a href="(.+?)" target="_blank">(.+?)<\/a>/g, '[$2]($1)')
        .replaceAll(/<img src="(.+?)" alt="(.+?)">/g, '![$2]($1)');
    }

    const header = (el: Element, html: string) => {
      markdown.push(`${'#'.repeat(Number(el.tagName.charAt(1)))} ${html}`);
    }

    const codeblock = (el: Element) => {
      for (const [i, code] of Array.from(el.children).entries()) {
        const text = code?.textContent ?? '';
        code.classList.remove('hljs');
        if (i === 0)
          markdown.push('```' + (code.classList.length > 0 ? code.classList[0] : ''))
        markdown.push(text.endsWith('\n') ? text.slice(0, -1) : text); //(code.textContent?.endsWith('\n') ? '' : '\n')
      }
      markdown.push('```');
    }

    const list = (el: Element, depth: number) => {
      for (const [i, li] of Array.from(el.children).entries()) {
        const nestedItemIndex = Array.from(li.childNodes).findIndex((v) => ['UL', 'OL'].includes(v.nodeName));
        
        let html = '';
        if (nestedItemIndex > -1) {
          Array.from(li.childNodes).forEach((node, i) => {
            if (i < nestedItemIndex)
              html += node.nodeType ===  Node.TEXT_NODE ? node.textContent : (node as HTMLElement).outerHTML;
          });
        } else {
          html = li.innerHTML;
        }

        const style = el.tagName === 'UL' ? '*' : `${i + 1}.`
        markdown.push('\u0020'.repeat(depth * 2).concat(style, ' ', $(html)));
        // markdown.push(`${'\u0020'.repeat(depth * 2)}${style} ${replaceHtmlToMarkdown(html)}`);

        if (nestedItemIndex > -1)
          list(li.childNodes.item(nestedItemIndex) as Element, depth + 1);
      }
    }
    
    for (const element of args.children) {
      // const html = [...htmlCharacterEntityMap.keys()].reduce(
      //   (acc, v) => acc.replaceAll(v, htmlCharacterEntityMap.get(v)),
      //   element.innerHTML
      // );

      const html = $(element.innerHTML
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&amp;', '&')
      );

      switch (element.tagName) {
        case 'HEADER':
          continue;
        case 'H1':
          header(element, html);
          break;
        case 'BLOCKQUOTE':
          markdown.push(`> ${html}`);
          break;
        case 'PRE':
          codeblock(element);
          break;
        case 'UL':
        case 'OL':
          list(element, 0);
          break;
        default:
          markdown.push(html);
      }
    }

    return markdown.join('\n');
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