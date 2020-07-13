import React, { useState, useEffect, createRef } from 'react';
import PropTypes from 'prop-types';
import {
  Modal, Button, TextArea, Form, Image, Grid,
} from 'semantic-ui-react';
import { Slider } from 'react-semantic-ui-range';
import AvatarEditor from 'react-avatar-editor';

import MetadataModalStyle from './MetadataModalStyle';

const MetadataModal = ({ cell, updateMyData }) => {
  const [itemMetadata, setItemMetadata] = useState({});
  const [productPicture, setProductPicture] = useState(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageResizeModalOpen, setImageResizeModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const productPictureRef = createRef();
  const editorRef = createRef();

  const sliderSettings = {
    start: 1,
    min: 0.5,
    max: 3,
    step: 0.05,
    onChange: (value) => {
      setZoom(value);
    },
  };

  useEffect(() => {
    if (cell.row) {
      setItemMetadata({ ...cell.row.original });
    }
    return () => {
      setItemMetadata({});
    };
  }, [cell]);

  useEffect(() => {
    if (!productPicture) {
      setImageResizeModalOpen(false);
    } else if (productPicture.name) {
      setImageResizeModalOpen(true);
    }
  }, [productPicture]);

  const handleChange = (e, { name, value }) => {
    setItemMetadata({ ...itemMetadata, [name]: value });
  };

  const handleApply = () => {
    if (editorRef.current) {
      const canvasScaled = editorRef.current.getImageScaledToCanvas();
      if (productPicture.name) {
        setItemMetadata({ ...itemMetadata, imageSource: canvasScaled.toDataURL() });
        setProductPicture(undefined);
      }
    }
    setImageResizeModalOpen(false);
  };

  const handleModalClose = () => {
    setProductPicture(undefined);
    setImageResizeModalOpen(false);
  };

  const handleSave = () => {
    updateMyData(cell.row.index, 'imageSource', itemMetadata.imageSource);
    updateMyData(cell.row.index, 'description', itemMetadata.description);
    setModalOpen(false);
  };

  return (
    <Modal open={modalOpen} trigger={<Button onClick={() => setModalOpen(true)} basic>Edit</Button>}>
      <Modal.Header>
        Edit
        {' '}
        {itemMetadata.name}
        {' '}
        metadata
      </Modal.Header>
      <Modal.Content>
        <MetadataModalStyle>
          <Grid width={16}>
            <Grid.Column width={6}>
              <div className="button-image-container">
                <Image className="product-image" src={itemMetadata.imageSource || '/images/products/blank-product.svg'} size="small" bordered centered />
                <Button inverted circular basic className="image-button" icon="camera" onClick={() => productPictureRef.current.click()} />
                <input
                  id="productPictureUpload"
                  ref={productPictureRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.svg,.webp,.gif"
                  hidden
                  onChange={(e) => setProductPicture(e.target.files[0])}
                />
              </div>
            </Grid.Column>
            <Grid.Column width={10}>
              <Form style={{ height: '100%' }}>
                <TextArea style={{ height: '100%' }} name="description" label="Description" value={itemMetadata.description || ''} onChange={handleChange} />
              </Form>
            </Grid.Column>
          </Grid>
        </MetadataModalStyle>
        <Modal className="image-resizer" open={imageResizeModalOpen} onClose={handleModalClose}>
          <Modal.Header>
            <Button floated="left" basic icon="left arrow" onClick={() => setImageResizeModalOpen(false)} />
            Resize
            {' '}
            <Button primary floated="right" content="Apply" onClick={handleApply} />
          </Modal.Header>
          <AvatarEditor
            ref={editorRef}
            image={productPicture}
            width={250}
            height={250}
            border={25}
            scale={zoom}
            color={[200, 200, 200, 0.6]}
          />
          <Modal.Content>
            <Slider value={zoom} color="blue" settings={sliderSettings} />
          </Modal.Content>
        </Modal>
      </Modal.Content>
      <Modal.Actions>
        <Button content="Cancel" onClick={() => setModalOpen(false)} />
        <Button primary content="Apply" onClick={handleSave} />
      </Modal.Actions>
    </Modal>
  );
};

MetadataModal.propTypes = {
  cell: PropTypes.object,
  updateMyData: PropTypes.func,
};

export default MetadataModal;
