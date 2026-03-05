/* eslint-disable global-require */
import React, { useState, useEffect } from 'react';
import { Transition, Header, Segment, Form, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { tr } from '../../utils/i18nRuntime';
const CommsOptionsForm = ({ formValues, setFormValues, profileStage }) => {
  const [visible, setVisible] = useState(false);
  const { contactOptions = {} } = formValues;

  // const contactOptions = {};

  useEffect(() => {
    if (profileStage === 2 && formValues.type === 'retailer') {
      setVisible(true);
      return;
    }
    setVisible(false);
  }, [formValues.type, profileStage]);

  // const handleChange = (event) => {
  //   console.log(event.target.name);
  // };

  return (
    <Transition.Group
      animation='fade'
      duration={{
        hide: 500,
        show: 2000,
      }}
    >
      {visible && (
        <Segment textAlign='left' basic>
          <Header as='h2'>
            {tr(
              'containers.createprofilepage.commsoptionsform.notification.preferences',
              'Notification preferences',
            )}
          </Header>
          <p>
            {tr(
              'containers.createprofilepage.commsoptionsform.choose.how.you.receive.notifications',
              'Choose how you receive notifications',
            )}
          </p>
          <Form>
            <Segment.Group>
              <Segment>
                <Header as='h3'>
                  {tr(
                    'containers.createprofilepage.commsoptionsform.orders',
                    'Orders',
                  )}
                </Header>
                <p>
                  {tr(
                    'containers.createprofilepage.commsoptionsform.notifications.for.any.orders.you.place.including.confirmations.reminders.etc',
                    'Notifications for any orders you place, including confirmations, reminders, etc.',
                  )}
                </p>
                <Grid>
                  <Grid.Column width={2}>
                    <Form.Checkbox
                      label={tr(
                        'containers.createprofilepage.commsoptionsform.email',
                        'Email',
                      )}
                      name='ordersEmail'
                      checked={contactOptions.ordersEmail || false}
                      onChange={() =>
                        setFormValues({
                          ...formValues,
                          contactOptions: {
                            ...contactOptions,
                            ordersEmail: !contactOptions.ordersEmail,
                          },
                        })
                      }
                    />
                  </Grid.Column>
                  <Grid.Column width={14}>
                    <Form.Checkbox
                      label={tr(
                        'containers.createprofilepage.commsoptionsform.web.and.mobile',
                        'Web & Mobile',
                      )}
                      name='ordersWebMobile'
                      checked={contactOptions.ordersWebMobile || false}
                      onChange={() =>
                        setFormValues({
                          ...formValues,
                          contactOptions: {
                            ...contactOptions,
                            ordersWebMobile: !contactOptions.ordersWebMobile,
                          },
                        })
                      }
                    />
                  </Grid.Column>
                </Grid>
              </Segment>
              <Segment>
                <Header as='h3'>
                  {tr(
                    'containers.createprofilepage.commsoptionsform.following',
                    'Following',
                  )}
                </Header>
                <p>
                  {tr(
                    'containers.createprofilepage.commsoptionsform.contact.from.breweries.that.you.follow',
                    'Contact from breweries that you follow.',
                  )}
                </p>
                <Grid>
                  {formValues.purchasingContactNumber && (
                    <Grid.Column width={2}>
                      <Form.Checkbox
                        label={tr(
                          'containers.createprofilepage.commsoptionsform.phone',
                          'Phone',
                        )}
                        name='followingPhone'
                        checked={contactOptions.followingPhone || false}
                        onChange={() =>
                          setFormValues({
                            ...formValues,
                            contactOptions: {
                              ...contactOptions,
                              followingPhone: !contactOptions.followingPhone,
                            },
                          })
                        }
                      />
                    </Grid.Column>
                  )}
                  <Grid.Column width={2}>
                    <Form.Checkbox
                      label={tr(
                        'containers.createprofilepage.commsoptionsform.email',
                        'Email',
                      )}
                      name='followingEmail'
                      checked={contactOptions.followingEmail || false}
                      onChange={() =>
                        setFormValues({
                          ...formValues,
                          contactOptions: {
                            ...contactOptions,
                            followingEmail: !contactOptions.followingEmail,
                          },
                        })
                      }
                    />
                  </Grid.Column>
                  <Grid.Column width={12} stretched>
                    <Form.Checkbox
                      label={tr(
                        'containers.createprofilepage.commsoptionsform.web.and.mobile',
                        'Web & Mobile',
                      )}
                      name='followingWebMobile'
                      checked={contactOptions.followingWebMobile || false}
                      onChange={() =>
                        setFormValues({
                          ...formValues,
                          contactOptions: {
                            ...contactOptions,
                            followingWebMobile:
                              !contactOptions.followingWebMobile,
                          },
                        })
                      }
                    />
                  </Grid.Column>
                </Grid>
              </Segment>
              <Segment>
                <Header as='h3'>
                  {tr(
                    'containers.createprofilepage.commsoptionsform.upcoming',
                    'Upcoming',
                  )}
                </Header>
                <p>
                  {tr(
                    'containers.createprofilepage.commsoptionsform.contact.from.us.about.new.and.upcoming.breweries.in.your.area',
                    'Contact from us about new and upcoming breweries in your area.',
                  )}
                </p>
                <Grid>
                  <Grid.Column width={2}>
                    <Form.Checkbox
                      label={tr(
                        'containers.createprofilepage.commsoptionsform.email',
                        'Email',
                      )}
                      name='upcomingEmail'
                      checked={contactOptions.upcomingEmail || false}
                      onChange={() =>
                        setFormValues({
                          ...formValues,
                          contactOptions: {
                            ...contactOptions,
                            upcomingEmail: !contactOptions.upcomingEmail,
                          },
                        })
                      }
                    />
                  </Grid.Column>
                  <Grid.Column width={14}>
                    <Form.Checkbox
                      label={tr(
                        'containers.createprofilepage.commsoptionsform.web.and.mobile',
                        'Web & Mobile',
                      )}
                      name='upcomingWebMobile'
                      checked={contactOptions.upcomingWebMobile || false}
                      onChange={() =>
                        setFormValues({
                          ...formValues,
                          contactOptions: {
                            ...contactOptions,
                            upcomingWebMobile:
                              !contactOptions.upcomingWebMobile,
                          },
                        })
                      }
                    />
                  </Grid.Column>
                </Grid>
              </Segment>
              <Segment>
                <Header as='h3'>
                  {tr(
                    'containers.createprofilepage.commsoptionsform.us',
                    'Us!',
                  )}
                </Header>
                <p>
                  {tr(
                    'containers.createprofilepage.commsoptionsform.occasional.curated.content.from.us.with.news.and.events.in.your.area',
                    'Occasional curated content from us with news and events in your area.',
                  )}
                </p>
                <Grid>
                  <Grid.Column width={2}>
                    <Form.Checkbox
                      label={tr(
                        'containers.createprofilepage.commsoptionsform.email',
                        'Email',
                      )}
                      name='usEmail'
                      checked={contactOptions.usEmail || false}
                      onChange={() =>
                        setFormValues({
                          ...formValues,
                          contactOptions: {
                            ...contactOptions,
                            usEmail: !contactOptions.usEmail,
                          },
                        })
                      }
                    />
                  </Grid.Column>
                  <Grid.Column width={14}>
                    <Form.Checkbox
                      label={tr(
                        'containers.createprofilepage.commsoptionsform.web.and.mobile',
                        'Web & Mobile',
                      )}
                      name='usWebMobile'
                      checked={contactOptions.usWebMobile || false}
                      onChange={() =>
                        setFormValues({
                          ...formValues,
                          contactOptions: {
                            ...contactOptions,
                            usWebMobile: !contactOptions.usWebMobile,
                          },
                        })
                      }
                    />
                  </Grid.Column>
                </Grid>
              </Segment>
            </Segment.Group>
          </Form>
        </Segment>
      )}
    </Transition.Group>
  );
};
CommsOptionsForm.propTypes = {
  profileStage: PropTypes.number,
  formValues: PropTypes.object,
  setFormValues: PropTypes.func,
};
export default CommsOptionsForm;
