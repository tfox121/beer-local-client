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
import TimeAgo from 'javascript-time-ago';
import PropTypes from 'prop-types';
import { Editor } from 'react-draft-wysiwyg';
import { BLOG_ITEMS_PER_PAGE } from '../../utils/constants';
import { getPrivateRoute } from '../../utils/api';
import BlogModalStyle from './BlogModalStyle';

const BlogPost = ({ blogPost, blogPage, index }) => {
  const parsedBlog = JSON.parse(blogPost.blogData);
  const initialContentState = convertFromRaw(parsedBlog);
  const [blogData, setBlogData] = useState(EditorState.createWithContent(initialContentState));
  const [blogMeta, setBlogMeta] = useState({ title: blogPost.title, author: blogPost.author, display: blogPost.display });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(false);

  const htmlString = stateToHTML(blogData.getCurrentContent());
  const timeAgo = new TimeAgo('en-UK');

  if (index < (blogPage * BLOG_ITEMS_PER_PAGE) - BLOG_ITEMS_PER_PAGE || index >= blogPage * BLOG_ITEMS_PER_PAGE) {
    return null;
  }

  if (!blogPost) {
    return null;
  }

  const handleEditConfirm = async () => {
    const contentState = blogData.getCurrentContent();
    const rawBlogData = convertToRaw(contentState);
    const privateRoute = await getPrivateRoute();
    const response = await privateRoute.patch('/producer/blog', { id: blogPost._id, rawBlogData: JSON.stringify(rawBlogData), blogMeta });
    setEditingBlog(false);
    console.log(response);
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
          {timeAgo.format(Date.parse(blogPost.created))}
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
                  {timeAgo.format(Date.parse(blogPost.created))}
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
};

export default BlogPost;
