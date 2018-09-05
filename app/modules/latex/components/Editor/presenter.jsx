// @flow

import * as React from 'react';
import { Tex, InlineTex } from 'react-tex';
import _ from 'lodash';
import html2canvas from 'html2canvas';

import { classie } from '../../../../utils';
import styles from './styles.css';

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
    inputValue: '\\int_{a}^{b} f(x)dx = F(b) - F(a)',
    demoString: demoTexString,
    useInline: false,
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
