import {
  Card,
  Title,
  ColGrid,
  Flex,
  Icon,
  Block,
  Text,
  Metric,
  LineChart,
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownItem
} from '@tremor/react';
import { useState, useEffect, SetStateAction } from 'react';
import { SignalIcon, TruckIcon, BellSnoozeIcon } from '@heroicons/react/24/solid';
import Head from 'next/head';

const TINYBIRD_HOST = process.env.NEXT_PUBLIC_TINYBIRD_HOST;
const TINYBIRD_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN;

export default function Dashboard() {

  const [filter, setFilter] = useState('All')
  const [names, setNames] = useState([{
    "name": ''
  }]);
  const [kpis, setKpis] = useState([{
    "events": 0,
    "speed": 0,
    "idle": 0
  }]);
  const [trend, setTrend] = useState([]);
  const [table, setTable] = useState([{
    "vehicle_id": 0,
    "client_name": '',
    "license_plate": '',
    "max_speed": 0,
    "latest_location": ''
  }]);
  
  let apiFilter = `https://${TINYBIRD_HOST}/v0/pipes/api_ui_filter.json?token=${TINYBIRD_TOKEN}`
  let apiKpis = `https://${TINYBIRD_HOST}/v0/pipes/api_kpis.json?token=${TINYBIRD_TOKEN}&name=${filter}`;
  let apiTrend = `https://${TINYBIRD_HOST}/v0/pipes/api_trend.json?token=${TINYBIRD_TOKEN}&name=${filter}`;
  let apiTable = `https://${TINYBIRD_HOST}/v0/pipes/api_vehicle_details.json?token=${TINYBIRD_TOKEN}&name=${filter}`;

  const fetchTinybirdUrl = async (fetchUrl: string, setState: Function) => {
    console.log(fetchUrl);
    const data = await fetch(fetchUrl)
    const jsonData = await data.json();
    setState(jsonData.data);
  };

  useEffect(() => {
    fetchTinybirdUrl(apiFilter, setNames)
  }, [apiFilter]);
  useEffect(() => {
    fetchTinybirdUrl(apiKpis, setKpis)
  }, [apiKpis]);
  useEffect(() => {
    fetchTinybirdUrl(apiTrend, setTrend)
  }, [apiTrend]);
  useEffect(() => {
    fetchTinybirdUrl(apiTable, setTable)
  }, [apiTable]);

  const numberFormatter = (number: number) => {
    return Intl.NumberFormat("us").format(number).toString();
  };

  return (
    <>
    <Head>
        <title>Vehicle Telemetry</title>
    </Head>

      <main className="bg-slate-50 p-6 sm:p-10">

          <Flex justifyContent="justify-between" alignItems="items-center">
              <Title>Vehicle Telemetry</Title>
              <Dropdown
                  defaultValue={ "All" }
                  onValueChange={ (value) => setFilter(value) }
                  maxWidth="max-w-sm"
              >
                  { (names?? []).map(item => 
                      <DropdownItem
                          key={ item.name }
                          value={ item.name }
                          text={ item.name }
                      />
                  ) }
              </Dropdown>
          </Flex>
          
          <ColGrid numCols={ 3 } gapX="gap-x-6" gapY="gap-y-6" marginTop="mt-6">
              <Card decoration="top" decorationColor="emerald">
                  <Flex justifyContent="justify-start" spaceX="space-x-4">
                      <Icon
                          icon={ SignalIcon }
                          variant="light"
                          size="xl"
                          color="emerald"
                      />
                      <Block truncate={ true }>
                          <Text>Total Events</Text>
                          <Metric truncate={ true }>{ numberFormatter(kpis?.[0].events) }</Metric>
                      </Block>
                  </Flex>
              </Card>
              <Card decoration="top" decorationColor="blue">
                  <Flex justifyContent="justify-start" spaceX="space-x-4">
                      <Icon
                          icon={ TruckIcon }
                          variant="light"
                          size="xl"
                          color="blue"
                      />
                      <Block truncate={ true }>
                          <Text>Average Speed</Text>
                          <Metric truncate={ true }>{ numberFormatter(kpis?.[0].speed) } mph</Metric>
                      </Block>
                  </Flex>
              </Card>
              <Card decoration="top" decorationColor="yellow">
                  <Flex justifyContent="justify-start" spaceX="space-x-4">
                      <Icon
                          icon={ BellSnoozeIcon }
                          variant="light"
                          size="xl"
                          color="yellow"
                      />
                      <Block truncate={ true }>
                          <Text>Average Time Idle</Text>
                          <Metric truncate={ true }>{ numberFormatter(kpis?.[0].idle) } %</Metric>
                      </Block>
                  </Flex>
              </Card>
          </ColGrid>
          
          <ColGrid numColsMd={ 2 } gapX="gap-x-6" gapY="gap-y-6" marginTop="mt-6">
              <Card>
                  <Title> Events Trend </Title>
                  <LineChart
                      data={ trend }
                      categories={["n_events","n_vehicles"]}
                      dataKey="ts"
                      colors={["emerald","slate"]}
                      valueFormatter={numberFormatter}
                      marginTop="mt-4"
                      height="h-96"
                  />
              </Card>
              <Card>
                  <Table marginTop="mt-0">
                      <TableHead>
                          <TableRow>
                              <TableHeaderCell textAlignment="text-left">Vehicle ID</TableHeaderCell>
                              <TableHeaderCell textAlignment="text-left">Client</TableHeaderCell>
                              <TableHeaderCell textAlignment="text-left">License Plate</TableHeaderCell>
                              <TableHeaderCell textAlignment="text-left">Max Speed</TableHeaderCell>
                              <TableHeaderCell textAlignment="text-left">Latest Location</TableHeaderCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                          { table.map((item) => (
                              <TableRow key={ item.vehicle_id }>
                                  <TableCell>{ item.vehicle_id }</TableCell>
                                  <TableCell>{ item.client_name }</TableCell>
                                  <TableCell>{ item.license_plate }</TableCell>
                                  <TableCell>{ item.max_speed }</TableCell>
                                  <TableCell>{ item.latest_location[0] }, { item.latest_location[1] }</TableCell>
                              </TableRow>
                          )) }
                      </TableBody>
                  </Table>
              </Card>
          </ColGrid>

          
      </main>
    </>
  );
}