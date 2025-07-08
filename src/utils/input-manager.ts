export default class InputManager {
  target?: Element | null;
  text?: string;
  sync?: boolean;

  nestedElementMap = new Map()
    .set('pre', 'code')
    .set('ul', 'li')
    .set('ol', 'li');

  focus = (target: Node, offset?: number) => {
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
    
  clear = (args?: HTMLElement) => {
    this.sync = !args;

    if (args) {
      this.target = args;
      this.text = args.innerHTML;
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

  find = (regexp: RegExp) => {
    if (!this.text) return;
    const matched = Array.from(this.text.matchAll(regexp));
    return matched.length > 0 ? matched : null;
  }

  replace = (tagName: string, value?: string, replaceWithNestedTag?: boolean): HTMLElement => {
    if (!this.target)
      return document.createElement('p');

    const parent = document.createElement(tagName);
    const innerHtml = value ?? '';
    
    if (Array.from(this.nestedElementMap.keys()).includes(tagName)) {
      const child = document.createElement(this.nestedElementMap.get(tagName));
      child.innerHTML = innerHtml;
      parent.append(child);
      this.target.replaceWith(replaceWithNestedTag ? child : parent);
    } else {
      parent.innerHTML = innerHtml;
      this.target.replaceWith(parent);
    }
    
    return parent;
  }

  change = (match: RegExpMatchArray, name: string, props?: { [key: string]: string }, exception?: boolean) => {
    if (!this.target || exception) return;

    const element = document.createElement(name);
    element.innerHTML = match[1].replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    if (props) {
      Object.keys(props).forEach((key: string) => {
        element.setAttribute(key, props[key]);
      });
    }

    if (this.sync) {
      const selection = window.getSelection();
      const node = selection?.focusNode;
      const offset = selection?.focusOffset;

      if (!offset) return;

      const text = node?.textContent ?? '';
      const childNodes = Array.from(this.target.childNodes.values());
      const index = childNodes.findIndex((v) => v === node);

      const prevNodes = childNodes.filter((v, i) => i < index).map((v) => v as Node);
      const splitText = document.createTextNode(text.substring(0, offset - match[0].length));
      const nextNodes = [
        document.createTextNode(text.substring(offset) || '\u200B'),
        ...childNodes.filter((v, i) => i > index).map((v) => v as Node)
      ];

      this.target.replaceChildren(...prevNodes, splitText, element, ...nextNodes);
      this.focus(nextNodes[0], Number(nextNodes[0].textContent === '\u200B'));
    } else {
      this.target.innerHTML = this.target.innerHTML.replace(match[0], element.outerHTML);
    }
  }

  iterator = (ul: Element, iterate: number): Element | null => {
    const li = ul.lastElementChild;
    const nestedUl = li?.lastElementChild;
    return (nestedUl && iterate - 1 > 0)
      ? this.iterator(nestedUl, iterate - 1)
      : li;
  }

  list = (name: string, depth: number, text: string) => {
    if (!this.target) return;

    const prev = this.target.previousElementSibling;
    if (!prev) return;

    const isDepthZero = depth === 0;
    const hasPrevList = prev && ['UL', 'OL'].includes(prev.tagName);

    if (isDepthZero) {
      if (hasPrevList) {
        const li = this.replace('li', text);
        prev.append(li);
        return li;
      } else {
        const ul = this.replace(name, text);
        const li = ul.lastElementChild;
        return li ? li as HTMLElement : null
      }
    } else {
      const appendedTarget = this.iterator(prev, depth / 2);
      if (!appendedTarget) return;

      const child = Array.from(appendedTarget.childNodes).find((v) => v.nodeName === 'UL');
      const li = this.replace(child ? 'li' : name, text);
      (child ?? appendedTarget).appendChild(li);
      this.target.remove();
      return li;
    }
  }
}