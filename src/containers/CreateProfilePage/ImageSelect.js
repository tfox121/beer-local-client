import React, { useState, createRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Image, Button, Modal, Header, Label,
} from 'semantic-ui-react';
import { Slider } from 'react-semantic-ui-range';
import AvatarEditor from 'react-avatar-editor';
import ImageSelectStyle from './ImageSelectStyle';

const ImageSelect = ({ avatarSaved, setAvatarSaved }) => {
  const [avatar, setAvatar] = useState({});
  const [zoom, setZoom] = useState(1);
  const [imageResizeModalOpen, setImageResizeModalOpen] = useState(false);

  const editorRef = createRef();
  const avatarRef = createRef();

  useEffect(() => {
    if (!avatar) {
      setImageResizeModalOpen(false);
    } else if (avatar.name) {
      setImageResizeModalOpen(true);
    }
  }, [avatar]);

  const sliderSettings = {
    start: 1,
    min: 0.5,
    max: 3,
    step: 0.05,
    onChange: (value) => {
      setZoom(value);
    },
  };

  const handleModalClose = () => {
    setAvatar({});
    setImageResizeModalOpen(false);
  };

  const handleApply = () => {
    if (editorRef.current) {
      const canvasScaled = editorRef.current.getImageScaledToCanvas();
      if (avatar.name) {
        setAvatar({});
        setAvatarSaved(canvasScaled.toDataURL());
      }
    }
    setImageResizeModalOpen(false);
  };

  return (
    <>
      <strong>Profile Picture</strong>
      <ImageSelectStyle>
        <Image className="profile-image" src={avatarSaved || '/images/avatars/blank-avatar.webp'} size="small" bordered centered circular />
        <Button inverted circular basic className="image-button" icon="camera" onClick={() => avatarRef.current.click()} />
        <input
          id="avatarUpload"
          ref={avatarRef}
          type="file"
          accept=".png,.jpg,.jpeg,.svg,.webp,.gif"
          hidden
          onChange={(e) => setAvatar(e.target.files[0])}
        />
      </ImageSelectStyle>
      <Modal className="image-resizer" open={imageResizeModalOpen} onClose={handleModalClose}>
        <Modal.Header>
          <Button floated="left" basic icon="left arrow" onClick={() => setImageResizeModalOpen(false)} />
          Edit picture
          {' '}
          <Button primary floated="right" content="Apply" onClick={handleApply} />
        </Modal.Header>
        <AvatarEditor
          ref={editorRef}
          image={avatar.name ? avatar : undefined}
          width={avatar.name ? 300 : 750}
          height={avatar.name ? 300 : 250}
          border={25}
          scale={zoom}
          color={[255, 255, 255, 0.6]}
        />
        <Modal.Content>
          <Slider value={zoom} color="blue" settings={sliderSettings} />
        </Modal.Content>
      </Modal>
    </>
  );
};

ImageSelect.propTypes = {
  avatarSaved: PropTypes.string,
  setAvatarSaved: PropTypes.func,
};

export default ImageSelect;
