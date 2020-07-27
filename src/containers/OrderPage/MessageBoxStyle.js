import styled from 'styled-components';

const MessageBoxStyle = styled.div`
  margin: 1em 0;
  display: flex;
  height: 6.5em;

  textarea {
    flex-grow: 4;
    resize: none;
    padding: 1em;
    border-radius: 4.5px 0 0 4.5px;
    border: 1px solid rgba(34,36,38,.15);
    border-right: 0;
  }

  textarea:focus {
    outline: none;
    border-color: #85b7d9;
  }

  div.primary.right.attached.button {
    display: flex;
    align-items: center;
    padding: 11px 20px;
  }
`;

export default MessageBoxStyle;
