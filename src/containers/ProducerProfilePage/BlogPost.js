/* eslint-disable react/no-danger */
/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import {
  convertFromRaw, EditorState, convertToRaw,
} from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import {
  Item, Modal, Button, Form,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Editor } from 'react-draft-wysiwyg';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { BLOG_ITEMS_PER_PAGE } from '../../utils/constants';
import timeAgo from '../../utils/timeAgo';
import { editBlog } from './actions';
import { makeSelectBlogPosting } from './selectors';

const BlogPost = ({
  blogPost, blogPage, index, blogEdit,
}) => {
  const parsedBlog = JSON.parse(blogPost.blogData);
  const initialContentState = convertFromRaw(parsedBlog);
  const [blogData, setBlogData] = useState(EditorState.createWithContent(initialContentState));
  const [blogMeta, setBlogMeta] = useState({ title: blogPost.title, author: blogPost.author, display: blogPost.display });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(false);

  const htmlString = stateToHTML(blogData.getCurrentContent());

  if (index < (blogPage * BLOG_ITEMS_PER_PAGE) - BLOG_ITEMS_PER_PAGE || index >= blogPage * BLOG_ITEMS_PER_PAGE) {
    return null;
  }

  if (!blogPost) {
    return null;
  }

  const handleEditConfirm = async () => {
    const contentState = blogData.getCurrentContent();
    const rawBlogData = convertToRaw(contentState);
    blogEdit({ id: blogPost._id, rawBlogData: JSON.stringify(rawBlogData), blogMeta });
    setEditingBlog(false);
  };

  return (
    <Item>
      <Item.Content>
        <Item.Header as="a">{blogMeta.title}</Item.Header>
        <Item.Meta>
          by
          {' '}
          {blogMeta.author}
          {' '}
          -
          {' '}
          {timeAgo.format(Date.parse(blogPost.createdAt))}
        </Item.Meta>
        <Item.Description>
          <div className="blog-description" dangerouslySetInnerHTML={{ __html: htmlString }} />
        </Item.Description>
        <Item.Extra>
          <Modal open={modalOpen} onClose={() => setModalOpen(false)} closeIcon trigger={<Button onClick={() => setModalOpen(true)} basic floated="right">Continue reading...</Button>}>
            <Modal.Header>
              {editingBlog
                ? <Form.Input label="Title" fluid width={7} value={blogMeta.title} onChange={(e) => setBlogMeta({ ...blogMeta, title: e.target.value })} placeholder="Post title..." />
                : <>{blogMeta.title}</>}
            </Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Editor
                  editorState={blogData}
                  toolbarClassName={editingBlog ? 'blog-editor-toolbar' : ''}
                  wrapperClassName={editingBlog ? 'blog-editor-wrapper' : ''}
                  editorClassName={editingBlog ? 'blog-editor' : ''}
                  onEditorStateChange={(editorState) => setBlogData(editorState)}
                  readOnly={!editingBlog}
                  toolbarHidden={!editingBlog}
                />
              </Modal.Description>
              {editingBlog && (
                <Form.Checkbox className="blogpost-display-checkbox" label="Display" checked={blogMeta.display} onChange={() => setBlogMeta({ ...blogMeta, display: !blogMeta.display })} />
              )}
            </Modal.Content>
            <Modal.Actions className="blogpost-modal-actions">
              <div>
                <p>
                  by
                  {' '}
                  {blogMeta.author}
                  {' '}
                  -
                  {' '}
                  {timeAgo.format(Date.parse(blogPost.createdAt))}
                  {' '}
                </p>
              </div>
              {editingBlog
                ? (
                  <>
                    <Button
                      onClick={() => setEditingBlog(false)}
                      content="Cancel"
                    />
                    <Button
                      color="green"
                      onClick={handleEditConfirm}
                      content="Save"
                    />
                  </>
                )
                : <Button primary onClick={() => setEditingBlog(true)} content="Edit" />}
            </Modal.Actions>
          </Modal>
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};

BlogPost.propTypes = {
  blogPost: PropTypes.object,
  blogPage: PropTypes.number,
  index: PropTypes.number,
  blogEdit: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  blogPosting: makeSelectBlogPosting(),
});

function mapDispatchToProps(dispatch) {
  return {
    blogEdit: (blogPost) => dispatch(editBlog(blogPost)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(BlogPost);
