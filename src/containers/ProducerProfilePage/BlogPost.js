/* eslint-disable react/no-danger */
/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import {
  convertFromRaw, EditorState, convertToRaw,
} from 'draft-js';
// import { stateToHTML } from 'draft-js-export-html';
import {
  Item, Button, Form, Segment, Grid,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Editor } from 'react-draft-wysiwyg';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { BLOG_ITEMS_PER_PAGE, BLOG_EDITOR_TOOLBAR, BLOG_CHARACTER_LIMIT } from '../../utils/constants';
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
  const [editingBlog, setEditingBlog] = useState(false);

  // const htmlString = stateToHTML(blogData.getCurrentContent());

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
    <Segment stacked style={{ marginTop: 0, marginBottom: 0 }}>
      <Item.Group>
        <Item>
          {/* <Item.Image src="https://react.semantic-ui.com/images/wireframe/image.png" /> */}
          <Item.Content>
            {editingBlog
              ? <Form.Input label="Title" fluid width={7} value={blogMeta.title} onChange={(e) => setBlogMeta({ ...blogMeta, title: e.target.value })} placeholder="Post title..." />
              : <Item.Header style={{ fontSize: '1.5em' }}>{blogMeta.title}</Item.Header>}
            <Item.Meta>
              by
              {' '}
              {blogMeta.author}
            </Item.Meta>
            <Item.Description>
              <Editor
                editorState={blogData}
                toolbarClassName={editingBlog ? 'blog-editor-toolbar' : ''}
                wrapperClassName={editingBlog ? 'blog-editor-wrapper' : ''}
                editorClassName={editingBlog ? 'blog-editor' : ''}
                onEditorStateChange={(editorState) => setBlogData(editorState)}
                readOnly={!editingBlog}
                toolbarHidden={!editingBlog}
                toolbar={BLOG_EDITOR_TOOLBAR}
                handleBeforeInput={(val) => {
                  const textLength = blogData.getCurrentContent().getPlainText().length;
                  if (val && textLength >= BLOG_CHARACTER_LIMIT) {
                    return 'handled';
                  }
                  return 'not-handled';
                }}
                handlePastedText={(val) => {
                  const textLength = blogData.getCurrentContent().getPlainText().length;
                  return ((val.length + textLength) >= BLOG_CHARACTER_LIMIT);
                }}
              />
            </Item.Description>
            <Item.Extra>
              {timeAgo.format(Date.parse(blogPost.createdAt))}
              {editingBlog
                ? (
                  <Grid style={{ padding: 0 }} textAlign="right" verticalAlign="middle">
                    <Grid.Column textAlign="left" width={2} style={{ padding: 0 }}>
                      <Form.Checkbox className="blogpost-display-checkbox" label="Display" checked={blogMeta.display} onChange={() => setBlogMeta({ ...blogMeta, display: !blogMeta.display })} />
                    </Grid.Column>
                    <Grid.Column width={10} />
                    <Grid.Column width={4} style={{ padding: 0 }}>
                      <Button
                        compact
                        onClick={() => setEditingBlog(false)}
                        content="Cancel"
                        floated="right"
                      />
                      <Button
                        compact
                        color="green"
                        onClick={handleEditConfirm}
                        content="Save"
                        floated="right"
                      />
                    </Grid.Column>
                  </Grid>
                )
                : (
                  <Grid style={{ padding: 0 }} textAlign="right" verticalAlign="middle">
                    <Grid.Column textAlign="left" width={2} style={{ padding: 0 }}>
                      {blogMeta.display ? <strong>Displayed</strong> : 'Hidden'}
                    </Grid.Column>
                    <Grid.Column width={12} />
                    <Grid.Column width={2} style={{ padding: 0 }}>
                      <Button compact basic floated="right" primary onClick={() => setEditingBlog(true)} content="Edit" />
                    </Grid.Column>
                  </Grid>
                )}
            </Item.Extra>
          </Item.Content>
        </Item>
      </Item.Group>
    </Segment>
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
