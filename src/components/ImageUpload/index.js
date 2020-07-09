/**
 *
 * ImageUpload
 *
 */

import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form, Button } from 'semantic-ui-react';

import { ACCEPTED_IMAGE_FORMATS } from '../../utils/constants';
import ImageUploadStyle from './ImageUploadStyle';
import messages from './messages';

function ImageUpload({ formValues, setFormValues, formErrors }) {
  const { pictureFile } = formValues;

  const fileInputRef = createRef();

  const fileChange = (e) => {
    setFormValues({
      ...formValues,
      pictureFile: e.target.files[0],
      avatar: true,
      fileValid: !!ACCEPTED_IMAGE_FORMATS[e.target.files[0].type],
      pictureFileExt: ACCEPTED_IMAGE_FORMATS[e.target.files[0].type],
    });
  };
  return (
    <ImageUploadStyle>
      <Form>
        <Form.Field>
          <label htmlFor="fileUpload">
            Profile picture
            <br />
            <Button
              type="button"
              content={
                pictureFile ? (
                  <div>{pictureFile.name}</div>
                ) : (
                  <FormattedMessage {...messages.chooseFile} />
                )
              }
              color={pictureFile ? 'grey' : 'blue'}
              labelPosition="left"
              icon="file image"
              onClick={() => fileInputRef.current.click()}
            />
            <input
              id="fileUpload"
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.svg,.webp,.gif"
              hidden
              onChange={fileChange}
            />
            {formErrors.pictureFile && (
              <div
                className="ui below pointing prompt label"
                role="alert"
                aria-atomic="true"
              >
                Invalid file type.
              </div>
            )}
          </label>
        </Form.Field>
      </Form>
    </ImageUploadStyle>
  );
}

ImageUpload.propTypes = {
  formValues: PropTypes.object,
  setFormValues: PropTypes.func,
  formErrors: PropTypes.object,
};

export default ImageUpload;
