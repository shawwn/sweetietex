// @flow

import * as React from 'react';

type TruncTextProps = {
  text?: string,
  maxLength?: number,
};

const TruncatedText = ({ text, maxLength }: TruncTextProps) => {
  const displayText = (maxLength >= 0) ?
    text.substring(0, maxLength) : text;

  return (
    <React.Fragment>
      {displayText}
    </React.Fragment>
  );
};

TruncatedText.defaultProps = {
  text: '',
  maxLength: -1,
};

export default TruncatedText;
