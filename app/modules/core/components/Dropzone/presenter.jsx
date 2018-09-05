// @flow

import * as React from 'react';
import DZ from 'react-dropzone';

type DZProps = {
  containerClassName?: string,
  className?: string,
  onDrop?: Function
};

type DZState = {};

class Dropzone extends React.Component<DZProps, DZState> {
  static defaultProps = {
    className: '',
    containerClassName: '',
    onDrop: () => {}
  };

  state = {};

  handleDrop = (files) => {
    const { onDrop } = this.props;
    if (onDrop) onDrop(files);
  };

  render() {
    const { containerClassName, className } = this.props;

    return (
      <div className={containerClassName}>
        <DZ
          className={className}
          onDrop={this.handleDrop}/>
      </div>
    );
  }
}

export default Dropzone;
