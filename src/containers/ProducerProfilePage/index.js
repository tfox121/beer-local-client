/**
 *
 * ProducerProfilePage
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {
  Segment,
  Image,
  Grid,
  Header,
  Button,
  Item,
  Modal,
  Pagination,
  Form,
} from 'semantic-ui-react';
import { Map, TileLayer } from 'react-leaflet';
import { stateToHTML } from 'draft-js-export-html';

import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import { baseURL, getPrivateRoute } from '../../utils/api';
import makeSelectProducerProfilePage, { makeSelectUser } from './selectors';
import { fetchProfile, clearProfile } from './actions';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';

import PageWrapper from '../../components/PageWrapper';
import DistributionAreaDisplay from '../../components/DistributionAreaDisplay';
import MapMarker from '../../components/MapMarker';
import StockModal from './StockModal';
import AvailabilityDynamic from './AvailabilityDynamic';
// import AvailabilityBasic from './AvailabilityBasic';

import MapStyle from './MapStyle';
import BlogStyle from './BlogStyle';
import { BLOG_ITEMS_PER_PAGE } from '../../utils/constants';

export function ProducerProfilePage({
  profileFetch,
  profileClear,
  producerProfilePage,
  user,
}) {
  useInjectReducer({ key: 'producerProfilePage', reducer });
  useInjectSaga({ key: 'producerProfilePage', saga });

  const {
    producerId,
    avatarSource,
    website,
    businessName,
    intro,
    salesEmail,
    salesContactNumber,
    location,
    distributionAreas,
    stock,
    blog,
  } = producerProfilePage.profile;

  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo('en-UK');

  const [modalOpen, setModalOpen] = useState(false);
  const [blogEditor, setBlogEditor] = useState(EditorState.createEmpty());
  const [blogMeta, setBlogMeta] = useState({ title: '', author: '' });
  const [blogPage, setBlogPage] = useState(1);

  useEffect(() => {
    profileClear();
    profileFetch();
  }, []);

  // useEffect(() => {
  //   if (blog && blog.length) {
  //     const parsedBlog = JSON.parse(blog[0].blogData);
  //     const contentState = convertFromRaw(parsedBlog);
  //     const html = stateToHTML(contentState);
  //     setBlogHTML(html);
  //     // setBlogEditor(EditorState.createWithContent(contentState));
  //   }
  // }, [blog]);

  const blogRender = (blogArray, page) => blogArray.map((blogPost, index) => {
    const parsedBlog = JSON.parse(blogPost.blogData);
    const contentState = convertFromRaw(parsedBlog);
    const htmlString = stateToHTML(contentState);
    const itemsPerPage = 2;
    if (index < (page * itemsPerPage) - itemsPerPage || index >= page * itemsPerPage) {
      return null;
    }
    return (
      <Item key={blogPost._id}>
        <Item.Content>
          <Item.Header as="a">{blogPost.title}</Item.Header>
          <Item.Meta>
            by
            {' '}
            {blogPost.author}
            {' '}
            -
            {' '}
            {timeAgo.format(Date.parse(blogPost.created))}
          </Item.Meta>
          <Item.Description>
            <div className="blog-description" dangerouslySetInnerHTML={{ __html: htmlString }} />
          </Item.Description>
          <Item.Extra>
            <Modal closeIcon trigger={<Button basic floated="right">Continue reading...</Button>}>
              <Modal.Header>{blogPost.title}</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  <Editor
                    editorState={EditorState.createWithContent(contentState)}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    readOnly
                    toolbarHidden
                  />
                </Modal.Description>
              </Modal.Content>
              <Modal.Actions>
                <p>
                  by
                  {' '}
                  {blogPost.author}
                  {' '}
                  -
                  {' '}
                  {timeAgo.format(Date.parse(blogPost.created))}
                  {' '}
                </p>
              </Modal.Actions>
            </Modal>
          </Item.Extra>
        </Item.Content>
      </Item>
    );
  });

  const handleBlogEditorChange = (editorState) => {
    setBlogEditor(editorState);
  };

  const handleBlogEditorSave = async () => {
    const contentState = blogEditor.getCurrentContent();
    const rawBlogData = convertToRaw(contentState);
    const privateRoute = await getPrivateRoute();
    const response = await privateRoute.post('/producer/blog', { rawBlogData: JSON.stringify(rawBlogData), blogMeta });
    console.log(response.data);
    setBlogEditor(EditorState.createEmpty());
    setBlogMeta({ title: '', author: '' });
    setModalOpen(false);
  };

  if (!producerProfilePage.profile) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{`beerLocal - ${businessName}`}</title>
        <meta name="description" content={`${businessName} - profile`} />
      </Helmet>
      <PageWrapper>
        <Segment basic textAlign="center">
          <Grid columns={3} padded="vertically">
            <Grid.Row>
              <Grid.Column width={4} verticalAlign="middle">
                <Image src={`${baseURL}${avatarSource}`} size="small" bordered centered circular />
              </Grid.Column>
              <Grid.Column width={8} textAlign="left">
                <Header as="h1">{businessName}</Header>
                <a href={website} target="_blank" rel="noopener noreferrer">
                  {website}
                </a>
                <p>{intro}</p>
                <Header as="h4">Contact</Header>
                <p>
                  Email:
                  {' '}
                  {salesEmail}
                  {' '}
                  / Tel:
                  {' '}
                  {salesContactNumber}
                </p>
              </Grid.Column>
              <Grid.Column width={4}>
                <MapStyle>
                  <Map
                    className="profileViewMap"
                    center={location}
                    zoom={6}
                    zoomControl={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                    />
                    <DistributionAreaDisplay
                      distributionAreas={distributionAreas}
                    />
                    <MapMarker location={location} />
                  </Map>
                </MapStyle>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Segment basic>
          <BlogStyle>
            <Grid columns={2} style={{ marginBottom: '0.05em' }}>
              <Grid.Column textAlign="left">
                <Header as="h2">Updates</Header>
              </Grid.Column>
              <Grid.Column textAlign="right">
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
                        onEditorStateChange={handleBlogEditorChange}
                        toolbar={{
                          options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'image', 'remove', 'history'],
                          inline: { options: ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript'] },
                          list: { inDropdown: true },
                          textAlign: { inDropdown: true },
                          link: { inDropdown: true },
                        }}
                      />
                    </Modal.Description>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button onClick={() => setModalOpen(false)} content="Cancel" />
                    <Button primary onClick={handleBlogEditorSave} content="Save" />
                  </Modal.Actions>
                </Modal>
              </Grid.Column>
            </Grid>
            <Item.Group divided>
              {blog && blog.length
                ? blogRender(blog, blogPage)
                : <Segment>No posts yet!</Segment>}
              {blog && blog.length > BLOG_ITEMS_PER_PAGE && (
                <Segment basic textAlign="center">
                  <Pagination
                    secondary
                    activePage={blogPage}
                    onPageChange={(e, { activePage }) => setBlogPage(activePage)}
                    totalPages={blog ? Math.ceil(blog.length / BLOG_ITEMS_PER_PAGE) : 0}
                  />
                </Segment>
              )}
            </Item.Group>
          </BlogStyle>
        </Segment>
        <Segment basic>
          <Grid columns={2} style={{ marginBottom: '0.05em' }}>
            <Grid.Column textAlign="left">
              <Header as="h2">Available Items</Header>
            </Grid.Column>
            <Grid.Column textAlign="right">
              {(user && user.producerId === producerId)
                  && <StockModal />}
            </Grid.Column>
          </Grid>
          {/* <AvailabilityBasic stock={stock} /> */}
          <AvailabilityDynamic data={stock} />
        </Segment>
      </PageWrapper>
    </>
  );
}

ProducerProfilePage.propTypes = {
  profileFetch: PropTypes.func.isRequired,
  profileClear: PropTypes.func.isRequired,
  producerProfilePage: PropTypes.object,
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

const mapStateToProps = createStructuredSelector({
  producerProfilePage: makeSelectProducerProfilePage(),
  user: makeSelectUser(),
});

function mapDispatchToProps(dispatch, { location }) {
  return {
    profileFetch: () => dispatch(fetchProfile(location.pathname)),
    profileClear: () => dispatch(clearProfile()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ProducerProfilePage);
