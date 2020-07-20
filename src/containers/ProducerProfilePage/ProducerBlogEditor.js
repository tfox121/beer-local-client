import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'semantic-ui-react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { postBlog } from './actions';

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
    <Modal open={modalOpen} trigger={<Button onClick={() => setModalOpen(true)} primary>Write new post</Button>}>
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
            toolbar={{
              options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'image', 'remove', 'history'],
              inline: { options: ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript'] },
              list: { inDropdown: true },
              textAlign: { inDropdown: true },
              link: { inDropdown: true },
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
