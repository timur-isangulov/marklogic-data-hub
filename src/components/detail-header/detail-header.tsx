import React from 'react';
import { Typography, Icon } from 'antd';
import styles from './detail-header.module.scss';
import { dateConverter } from '../../util/date-conversion';

interface Props {
  document: any;
  contentType: string;
  primaryKey: string;
  uri: string
};

const DetailHeader: React.FC<Props> = (props) => {
  const { Text } = Typography;
  const fileType = props.contentType.toUpperCase();
  let envelope: any = {};
  let title: string = '';
  let primaryKey: string = '';
  let id: string = '';
  let timestamp: string = '';
  let sources: string = '';
  let document: any = {};

  if (fileType === 'JSON') {
    envelope = props.document.envelope;
    document = Object.keys(envelope.instance)[0];
    title = envelope.instance.info.hasOwnProperty('title') && envelope.instance.info.title;
    timestamp = envelope.headers.hasOwnProperty('createdOn') && envelope.headers.createdOn;
    sources = envelope.headers.hasOwnProperty('sources') && envelope.headers.sources[0].name;
    if (props.primaryKey) {
      Object.keys(props.document.envelope.instance).forEach(instance => {
        if (instance !== 'info') {
          Object.keys(props.document.envelope.instance[instance]).forEach(function (key) {
            if (props.primaryKey === props.document.envelope.instance[instance][key]) {
              primaryKey = key;
              id = props.document.envelope.instance[instance][key]
            }
          });
        }
      });
    } else {
      id = props.uri;
    }
  } else if (fileType === 'XML') {
    envelope = props.document.content.envelope;
    document = Object.keys(envelope.instance)[1];
    title = envelope.instance.info.hasOwnProperty('title') && envelope.instance.info.title;
    if (props.primaryKey) {
      Object.keys(props.document.content.envelope.instance).forEach(instance => {
        if (instance !== 'info') {
          Object.keys(props.document.content.envelope.instance[instance]).forEach(function (key) {
            if (props.primaryKey == props.document.content.envelope.instance[instance][key]) {
              primaryKey = key;
              id = props.document.content.envelope.instance[instance][key];
            }
          });
        }
      });
    } else {
      id = props.uri;
    }

    //TODO add primaryKey or Uri functionality
  }

  return (
    <div id='header'>
      <div id='title' className={styles.title}>
        <Text data-cy="document-title">{title} </Text>
        <Icon style={{ fontSize: '12px' }} type="right" />
        {props.primaryKey ? (
          <>
            <Text type="secondary"> {primaryKey}: </Text>
            <Text data-cy="document-id">{id}</Text>
          </>
        ) : (
            <>
              <Text type="secondary"> uri: </Text>
              <Text data-cy="document-uri">{id}</Text>
            </>
          )}
      </div>
      <div id='summary' className={styles.summary}>
        <Text type="secondary">Created: </Text>
        <Text data-cy="document-timestamp">{dateConverter(timestamp)}</Text>
        <Text type="secondary">&nbsp; &nbsp; Sources: </Text>
        <Text data-cy="document-source">{sources}</Text>
        <Text type="secondary">&nbsp; &nbsp; File Type: </Text>
        <Text data-cy="document-filetype">{fileType}</Text>
      </div>
    </div>
  )
}

export default DetailHeader;