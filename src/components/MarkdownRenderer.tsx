import { marked, Renderer } from "marked";
import styles from "./MarkdownRenderer.module.css";

const renderer = new Renderer();

const _defaultLink = renderer.link.bind(renderer);
renderer.link = (token) => {
  const html = _defaultLink(token);
  return html.replace(/^<a /, '<a target="_blank" rel="noopener noreferrer" ');
};

marked.use({
  renderer,
  gfm: true,
  breaks: true,
});

function stripDangerous(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]*/gi, "");
}

interface Props {
  source: string;
}

export function MarkdownRenderer(props: Props) {
  const html = () => stripDangerous(marked.parse(props.source) as string);
  return <div class={styles.markdownBody} innerHTML={html()} />;
}
