// @flow

import * as React from 'react';
import { Tex } from 'react-tex';

import { classie } from '../../../../utils';
import styles from './styles.css';

type EditorProps = {};

type EditorState = {
  inputValue: string,
};

class Editor extends React.Component<EditorProps, EditorState> {
  inputRef: null;

  state = {
    inputValue: '\\int_{a}^{b} f(x)dx = F(b) - F(a)',
  };

  onTextChange = (evt) => {
    const { target: { value } } = evt;
    this.setState({ inputValue: value });
  };

  setInputRef = (el) => {
    this.inputRef = el;
  };

  render() {
    const { inputValue } = this.state;

    return (
      <div className={classie([styles.main])}>
        <h3 className={styles.title}>Editor</h3>

        <textarea
          ref={this.setInputRef}
          onChange={this.onTextChange}
          className={styles.inputTextarea}
          value={inputValue} />

        <h3 className={styles.title}>Output:</h3>

        <Tex texContent={inputValue}/>
      </div>
    );
  }
}

export default Editor;
