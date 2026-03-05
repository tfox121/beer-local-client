/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Header,
  Segment,
  Button,
  Transition,
  Form,
  Icon,
  Responsive,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import { Helmet } from 'react-helmet';
import messages from './messages';
import PageWrapper from '../../components/PageWrapper';
import { useUserQuery } from '../../queries/user';
import RetailerDashboardPage from '../RetailerDashboardPage';
import ProducerDashboardPage from '../ProducerDashboardPage';
import HomepageStyle from './HomepageStyle';

const HomePage = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { data: userProfile } = useUserQuery({ enabled: isAuthenticated });
  const [buttonVisible, setButtonVisible] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState(null);

  useEffect(() => {
    if (localStorage.businessName && businessName === '') {
      setBusinessName(localStorage.businessName);
    }
    if (localStorage.businessType && businessType === '') {
      setBusinessType(localStorage.businessType);
    }
  }, []);

  let formAnimation = 'fly right';

  // if (!userProfile.sub) {
  //   userFetch();
  // }

  const homeDisplay = (authenticated, user) => {
    if (authenticated && !user) {
      return (
        <>
          <Helmet>
            <title>BeerLocal - Buy Local. Sell Local.</title>
            <meta name='description' content='Homepage' />
            <meta property='og:image' content='./images/Homepage.png' />
            <meta property='og:image:type' content='image/png' />
            <meta property='og:image:width' content='1024' />
            <meta property='og:image:height' content='1024' />
          </Helmet>
          <PageWrapper>
            <HomepageStyle>
              <div className='full-page' />
              <Segment basic textAlign='center'>
                <Header className='secondary'>
                  <FormattedMessage {...messages.header} />
                  {businessName && (
                    <>
                      {', '}
                      {businessName}
                    </>
                  )}
                  {'!'}
                </Header>
                <Segment basic padded='very' textAlign='center'>
                  <Link to='/create'>
                    <Button size='massive' primary>
                      Complete Your Profile
                    </Button>
                  </Link>
                </Segment>
              </Segment>
            </HomepageStyle>
          </PageWrapper>
        </>
      );
    }
    if (user && user.role === 'retailer') {
      return <RetailerDashboardPage />;
    }
    if (user && user.role === 'producer') {
      return <ProducerDashboardPage />;
    }

    const businessTypes = [
      {
        key: 'Breweryr',
        text: 'Brewery',
        value: 'producer',
      },
      {
        key: 'Retailer',
        text: 'Retailer',
        value: 'retailer',
      },
    ];

    const handleClick = () => {
      setButtonVisible(false);
      setFormVisible(true);
      formAnimation = 'fly left';
    };

    const handleSubmit = () => {
      setFormVisible(false);
      localStorage.businessName = businessName;
      localStorage.businessType = businessType;
      loginWithRedirect();
    };

    return (
      <>
        <Helmet>
          <title>BeerLocal - Buy Local. Sell Local.</title>
          <meta name='description' content='Homepage' />
          <meta property='og:image' content='./images/Homepage.png' />
          <meta property='og:image:type' content='image/png' />
          <meta property='og:image:width' content='1024' />
          <meta property='og:image:height' content='1024' />
        </Helmet>
        <PageWrapper>
          <HomepageStyle>
            <div className='full-page' />
            <Segment basic textAlign='center'>
              <Header className='primary'>BeerLocal</Header>
              <Header as='h5' className='sub-header'>
                Buy local. Sell local.
              </Header>
              <div className='action-group'>
                <Transition.Group animation='fly left' duration={700}>
                  {buttonVisible && (
                    <Button
                      size='large'
                      inverted
                      icon='angle right'
                      labelPosition='right'
                      content='Get Started'
                      onClick={handleClick}
                    />
                  )}
                </Transition.Group>
                <Transition.Group animation={formAnimation} duration={700}>
                  {formVisible && (
                    <Form onSubmit={handleSubmit}>
                      <Form.Group widths='equal'>
                        <Form.Input
                          placeholder='Business name'
                          value={businessName}
                          onChange={(e, { value }) => setBusinessName(value)}
                          required
                        />
                        <Form.Dropdown
                          placeholder='Business type'
                          value={businessType}
                          onChange={(e, { value }) => setBusinessType(value)}
                          required
                          selection
                          options={businessTypes}
                        />
                        <Responsive maxWidth={425}>
                          <Form.Button basic control={Button} inverted>
                            Submit
                          </Form.Button>
                        </Responsive>
                        <Responsive minWidth={426}>
                          <Form.Button basic icon control={Button} inverted>
                            <Icon name='angle right' />
                          </Form.Button>
                        </Responsive>
                      </Form.Group>
                    </Form>
                  )}
                </Transition.Group>
              </div>
            </Segment>
          </HomepageStyle>
        </PageWrapper>
      </>
    );
  };

  return <>{homeDisplay(isAuthenticated, userProfile)}</>;
};

export default HomePage;
