import React, { useState } from 'react';
import {
  Header, Segment, Table, Dropdown, Grid,
} from 'semantic-ui-react';

import { Helmet } from 'react-helmet';
import geoJsonContainsCoords from '../../utils/geoJsonContainsCoords';
import PageWrapper from '../../components/PageWrapper';
import ProducerListPageStyle from './ProducerListPageStyle';
import ProducerListItem from './ProducerListItem';
import { useProducersQuery } from '../../queries/producers';
import { useUserQuery } from '../../queries/user';

const ProducerListPage = () => {
  const { data: producers = [] } = useProducersQuery();
  const { data: user } = useUserQuery();

  // const [areaFilterToggle, setareaFilterToggle] = useState(true);
  // const [followedFilterToggle, setfollowedFilterToggle] = useState(false);
  const [filter, setFilter] = useState(['area']);

  const followedProducers = !!user && (user.followedProducers || []).map((producer) => producer.sub);

  const followedFilter = (producer) => followedProducers.includes(producer.sub);

  const areaFilter = (producer) => geoJsonContainsCoords(producer.distributionAreas, user.location);

  const distantPurchasingFilter = (producer) => (producer.profileOptions.distantPurchasing || geoJsonContainsCoords(producer.distributionAreas, user.location));

  // const filteredProducers = !!producers && !!user && producers.filter();

  const filterCombine = (producerArr) => {
    let filteredProducers = [...producerArr];
    if (filter.includes('area')) {
      filteredProducers = filteredProducers.filter(areaFilter);
    }
    if (filter.includes('followed')) {
      filteredProducers = filteredProducers.filter(followedFilter);
    }
    if (filter.includes('distantPurchasing')) {
      filteredProducers = filteredProducers.filter(distantPurchasingFilter);
    }
    return filteredProducers;
  };

  // console.log('FILTERED', filteredProducers);

  // if (producers && user) {
  //   producers.forEach((producer) => {
  //     console.log(checkPolygonsContainCoords(producer.distributionAreas, user.location));
  //   });
  // }

  const handleChange = (e, { value }) => {
    setFilter(value);
  };

  if (!user || !producers.length) {
    return null;
  }

  const filterOptions = [
    { key: 'area', text: 'In my area', value: 'area' },
    { key: 'followed', text: 'Followed breweries', value: 'followed' },
    { key: 'distantPurchasing', text: 'Can ship to me', value: 'distantPurchasing' },
  ];

  return (
    <>
      <Helmet>
        <title>BeerLocal - Breweries</title>
        <meta name="description" content="A list of breweries" />
      </Helmet>
      <PageWrapper>
        <ProducerListPageStyle>
          <Segment basic className="primary wrapper">
            <Grid width={16}>
              <Grid.Column width={6}>
                <Header as="h1" floated="left">Breweries</Header>
              </Grid.Column>
              <Grid.Column width={10} textAlign="right">
                <Dropdown value={filter} onChange={handleChange} placeholder="Filter" multiple selection options={filterOptions} />
                {/* <Checkbox label="In my area" toggle checked={areaFilterToggle} onClick={() => setareaFilterToggle(!areaFilterToggle)} />
              {' '}
              <Checkbox label="Followed" toggle checked={followedFilterToggle} onClick={() => setfollowedFilterToggle(!followedFilterToggle)} /> */}
              </Grid.Column>
            </Grid>
            <Table basic unstackable>
              <Table.Body>
                {producers && filterCombine(producers).map((producer) => (
                  <React.Fragment key={producer._id}>
                    <ProducerListItem user={user} producer={producer} />
                  </React.Fragment>
                ))}
              </Table.Body>
            </Table>
          </Segment>
        </ProducerListPageStyle>
      </PageWrapper>
    </>
  );
};

export default ProducerListPage;
