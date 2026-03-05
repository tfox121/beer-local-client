import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'semantic-ui-react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import {
  BLOG_CHARACTER_LIMIT,
  BLOG_EDITOR_TOOLBAR,
} from '../../utils/constants';
import { usePostBlogMutation } from '../../queries/producerProfile';
import { tr } from '../../utils/i18nRuntime';
const ProducerBlogEditor = ({ onBlogPosted }) => {
  const { mutateAsync: blogPost, isLoading: blogPosting } =
    usePostBlogMutation();
  const [blogEditor, setBlogEditor] = useState(EditorState.createEmpty());
  const [blogMeta, setBlogMeta] = useState({
    title: '',
    author: '',
    display: true,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const handleBlogEditorSave = async () => {
    const contentState = blogEditor.getCurrentContent();
    const rawBlogData = convertToRaw(contentState);
    await blogPost({
      rawBlogData: JSON.stringify(rawBlogData),
      blogMeta,
    });
    setBlogEditor(EditorState.createEmpty());
    setBlogMeta({
      title: '',
      author: '',
      display: true,
    });
    setModalOpen(false);
    if (onBlogPosted) {
      onBlogPosted();
    }
  };
  return (
    <Modal
      open={modalOpen}
      trigger={
        <Button onClick={() => setModalOpen(true)} primary>
          {tr('containers.producerprofilepage.producerblogeditor.add', 'Add')}
        </Button>
      }
    >
      <Modal.Header>
        {tr(
          'containers.producerprofilepage.producerblogeditor.new.post',
          'New post',
        )}
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Form>
            <Form.Group>
              <Form.Input
                label={tr(
                  'containers.producerprofilepage.producerblogeditor.title',
                  'Title',
                )}
                fluid
                width={7}
                value={blogMeta.title}
                onChange={(e) =>
                  setBlogMeta({
                    ...blogMeta,
                    title: e.target.value,
                  })
                }
                placeholder={tr(
                  'containers.producerprofilepage.producerblogeditor.post.title',
                  'Post title...',
                )}
              />
              <Form.Input
                label={tr(
                  'containers.producerprofilepage.producerblogeditor.author',
                  'Author',
                )}
                fluid
                width={5}
                value={blogMeta.author}
                onChange={(e) =>
                  setBlogMeta({
                    ...blogMeta,
                    author: e.target.value,
                  })
                }
                placeholder={tr(
                  'containers.producerprofilepage.producerblogeditor.author',
                  'Author',
                )}
              />
            </Form.Group>
          </Form>
          <Editor
            editorState={blogEditor}
            toolbarClassName='blog-editor-toolbar'
            wrapperClassName='blog-editor-wrapper'
            editorClassName='blog-editor'
            onEditorStateChange={(editorState) => setBlogEditor(editorState)}
            toolbar={BLOG_EDITOR_TOOLBAR}
            handleBeforeInput={(val) => {
              const textLength = blogEditor
                .getCurrentContent()
                .getPlainText().length;
              if (val && textLength >= BLOG_CHARACTER_LIMIT) {
                return 'handled';
              }
              return 'not-handled';
            }}
            handlePastedText={(val) => {
              const textLength = blogEditor
                .getCurrentContent()
                .getPlainText().length;
              return val.length + textLength >= BLOG_CHARACTER_LIMIT;
            }}
          />
        </Modal.Description>
        <Form.Checkbox
          className='blogpost-display-checkbox'
          label={tr(
            'containers.producerprofilepage.producerblogeditor.display',
            'Display',
          )}
          checked={blogMeta.display}
          onChange={() =>
            setBlogMeta({
              ...blogMeta,
              display: !blogMeta.display,
            })
          }
        />
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={() => setModalOpen(false)}
          content={tr(
            'containers.producerprofilepage.producerblogeditor.cancel',
            'Cancel',
          )}
        />
        <Button
          primary
          loading={blogPosting}
          onClick={handleBlogEditorSave}
          content={tr(
            'containers.producerprofilepage.producerblogeditor.save',
            'Save',
          )}
        />
      </Modal.Actions>
    </Modal>
  );
};
ProducerBlogEditor.propTypes = {
  onBlogPosted: PropTypes.func,
};
export default ProducerBlogEditor;
