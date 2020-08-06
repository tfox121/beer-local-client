import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'semantic-ui-react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { postBlog } from './actions';
import { BLOG_CHARACTER_LIMIT, BLOG_EDITOR_TOOLBAR } from '../../utils/constants';

const ProducerBlogEditor = ({ blogPost }) => {
  const [blogEditor, setBlogEditor] = useState(EditorState.createEmpty());
  const [blogMeta, setBlogMeta] = useState({ title: '', author: '', display: true });
  const [modalOpen, setModalOpen] = useState(false);

  const handleBlogEditorSave = async () => {
    const contentState = blogEditor.getCurrentContent();
    const rawBlogData = convertToRaw(contentState);
    blogPost({ rawBlogData: JSON.stringify(rawBlogData), blogMeta });
    setBlogEditor(EditorState.createEmpty());
    setBlogMeta({ title: '', author: '', display: true });
    setModalOpen(false);
  };

  return (
    <Modal open={modalOpen} trigger={<Button onClick={() => setModalOpen(true)} primary>Add</Button>}>
      <Modal.Header>New post</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Form>
            <Form.Group>
              <Form.Input label="Title" fluid width={7} value={blogMeta.title} onChange={(e) => setBlogMeta({ ...blogMeta, title: e.target.value })} placeholder="Post title..." />
              <Form.Input label="Author" fluid width={5} value={blogMeta.author} onChange={(e) => setBlogMeta({ ...blogMeta, author: e.target.value })} placeholder="Author" />
            </Form.Group>
          </Form>
          <Editor
            editorState={blogEditor}
            toolbarClassName="blog-editor-toolbar"
            wrapperClassName="blog-editor-wrapper"
            editorClassName="blog-editor"
            onEditorStateChange={(editorState) => setBlogEditor(editorState)}
            toolbar={BLOG_EDITOR_TOOLBAR}
            handleBeforeInput={(val) => {
              const textLength = blogEditor.getCurrentContent().getPlainText().length;
              if (val && textLength >= BLOG_CHARACTER_LIMIT) {
                return 'handled';
              }
              return 'not-handled';
            }}
            handlePastedText={(val) => {
              const textLength = blogEditor.getCurrentContent().getPlainText().length;
              return ((val.length + textLength) >= BLOG_CHARACTER_LIMIT);
            }}
          />
        </Modal.Description>
        <Form.Checkbox className="blogpost-display-checkbox" label="Display" checked={blogMeta.display} onChange={() => setBlogMeta({ ...blogMeta, display: !blogMeta.display })} />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setModalOpen(false)} content="Cancel" />
        <Button primary onClick={handleBlogEditorSave} content="Save" />
      </Modal.Actions>
    </Modal>

  );
};

ProducerBlogEditor.propTypes = {
  blogPost: PropTypes.func,
};

// const mapStateToProps = createStructuredSelector({
//   blogPosting: makeSelectBlogPosting(),
// });

function mapDispatchToProps(dispatch) {
  return {
    blogPost: (blogPost) => dispatch(postBlog(blogPost)),
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(ProducerBlogEditor);
