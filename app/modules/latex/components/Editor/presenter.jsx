// @flow

import * as React from 'react';
import { Tex } from 'react-tex';
import _ from 'lodash';
import html2canvas from 'html2canvas';

import { classie } from '../../../../utils';
import styles from './styles.css';

import katex from 'katex';

class InlineTex extends React.Component{
  static texTransform(content = '', lh = '\\${2}', rh = '\\${2}', after = x => x, before = x => x) {
    let pattern  = new RegExp(lh + "(.+?)" + rh,"g")
    let html = content.replace(pattern,function(x, string){
      return string ? after(katex.renderToString(before(string),{"throwOnError":false})) : "";
    });
    return html;
  }
  static texHTML(content='', tag="span", sep="\n<br><br>\n") {
    content = `<${tag}>` + content.replace(new RegExp("[\\n][\\n \\t]+", 'g'), `</${tag}>${sep}<${tag}>`) + `</${tag}>`;
    content = InlineTex.texTransform(content, '[$][$]', '[$][$]',
        x => `</${tag}><${"center"}><${tag}>${x}</${tag}></${"center"}><${tag}>`);
    content = InlineTex.texTransform(content, '[$]', '[$]', x => x);
    content = InlineTex.texTransform(content, '[\\\\][(]', '[\\\\][)]', x => x,
      x => x,
      //x => `\\left(${x}\\right)`,
    );
    return content;
  }
  render(){
    let { texContent } = this.props;
    let html = InlineTex.texHTML(texContent || '');
    return(
      <div dangerouslySetInnerHTML={{__html: html}}/>
    )
  }
}

global.InlineTex = InlineTex;

type EditorProps = {};

type EditorState = {
  inputValue: string,
  useInline: boolean,
  demoString: string,
  dataUrl: string,
};

const demoTexString = '\\int_{a}^{b} f(x)dx = F(b) - F(a)';
const demoInlineString = 'I have inline tex! $$\\int_{a}^{b} f(x)dx = F(b) - F(a)$$';

class Editor extends React.Component<EditorProps, EditorState> {
  inputRef: null;

  debouncedImageGen: Function;

  state = {
    inputValue: '\\(\\int_{a}^{b} f(x)dx = F(b) - F(a)\\)',
    demoString: demoTexString,
    useInline: true,
    dataUrl: '',
  };

  componentDidMount() {
    this.debouncedImageGen = _.debounce(this.generateImage, 500);
    this.debouncedImageGen();
  }

  getSaveableImage = () => {
    const canvas = document.getElementById('tex-output');
    if (canvas) {
      const dataUrl = canvas.toDataURL();
      this.setState({ dataUrl });
    }
  };

  generateImage = async () => {
    const node = document.querySelector('#tex-container');
    const canvasNode = document.querySelector('#tex-output');

    try {
      await html2canvas(node, {
        canvas: canvasNode,
        height: 500,
        width: '100%',
      });
      this.getSaveableImage();
    } catch (err) {
      console.log(err);
    }
  };

  onTextChange = (evt) => {
    const { target: { value } } = evt;

    this.setState({ inputValue: value }, () => {
      this.debouncedImageGen();
    });
  };

  handleInlineCheckbox = (evt) => {
    const { target: { checked } } = evt;

    this.setState({
      useInline: checked,
      demoString: checked ? demoInlineString : demoTexString,
    });
  };

  setInputRef = (el) => {
    this.inputRef = el;
  };

  render() {
    const { inputValue, useInline, demoString, dataUrl } = this.state;

    return (
      <div className={classie([styles.main])}>
        <h3 className={styles.title}>Editor</h3>

        <label>
          <input
            id="useInline"
            checked={useInline}
            type="checkbox"
            onChange={this.handleInlineCheckbox} />
          Use Inline Tex
        </label>

        <p className={styles.demoString}>
          Example:
          <br />
          <br />
          {demoString}
        </p>

        <textarea
          ref={this.setInputRef}
          onChange={this.onTextChange}
          className={styles.inputTextarea}
          value={inputValue} />

        <h3 className={styles.title}>Output:</h3>

        <a
          download="sweetietex.png"
          href={dataUrl}
          className={styles.save}>Save PNG</a>

        <div className={styles.output}>
          <div id="tex-container">
            {useInline ?
              <InlineTex texContent={inputValue}/> :
              <Tex texContent={inputValue}/>}
          </div>

          <div className={styles.texOutput}>
            <canvas id="tex-output" height={500} width="100%" />
          </div>
        </div>
      </div>
    );
  }
}

export default Editor;
