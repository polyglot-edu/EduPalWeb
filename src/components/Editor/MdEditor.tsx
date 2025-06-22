import Editor, { PluginProps, Plugins } from 'react-markdown-editor-lite';
import { HtmlType } from 'react-markdown-editor-lite/cjs/editor/preview';
import { EditorConfig } from 'react-markdown-editor-lite/cjs/share/var';

interface EditorProps extends EditorConfig {
  id?: string;
  defaultValue?: string;
  value?: string;
  renderHTML: (text: string) => HtmlType | Promise<HtmlType> | (() => HtmlType);
  style?: React.CSSProperties;
  autoFocus?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  config?: any;
  plugins?: string[];
  onChange?: (
    data: {
      text: string;
      html: string;
    },
    event?: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onScroll?: (
    e: React.UIEvent<HTMLTextAreaElement | HTMLDivElement>,
    type: 'md' | 'html'
  ) => void;
}

const CustomUnderline = (props: PluginProps) => {
  const handleClick = () => {
    // Call API, insert number to editor
    const selection = props.editor.getSelection().text;
    props.editor.insertText('<u>' + selection + '</u>', true);
  };

  return (
    <span
      className="button button-type-underline"
      title="Underline"
      onClick={handleClick}
    >
      <i className={`rmel-iconfont rmel-icon-underline`} />
    </span>
  );
};

CustomUnderline.align = 'left';
CustomUnderline.pluginName = 'custom-underline';

Editor.unuse(Plugins.FontUnderline);

Editor.use(CustomUnderline);

const MdEditor = (props: EditorProps) => <Editor {...props} />;

export default MdEditor;
