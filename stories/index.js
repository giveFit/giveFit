import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Button from './Button';
import Welcome from './Welcome';
import Group from './Group';

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')}/>
  ));

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ));

storiesOf('Group', module)
  .addDecorator(story => (
    <MuiThemeProvider muiTheme={getMuiTheme()}>
      {story()}
    </MuiThemeProvider>
  ))
  .add('with text', () => (
  <Group 
	author="Joshua Montgomery"
	avatar="https://robohash.org/iureexexpedita.png?size=50x50&set=set1"
	contentSnippet="elementum pellentesque quisque porta volutpat erat quisque erat eros viverra eget congue eget semper rutrum nulla nunc purus phasellus"
	date="2/14/2017"
	day="nisl"
	id="502062160786789448"
	image="http://dummyimage.com/239x100.png/dddddd/000000"
	location="00865 Garrison Street"
  workoutName="Next workout: get swole"
	tags="[object Object]"
	time="10:50 AM"
	title="pellentesque at"
  />
  ));

  


