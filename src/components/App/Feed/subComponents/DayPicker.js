import React from 'react'
import { Tab, Tabs } from 'material-ui'
import GroupCreatorWithData from './GroupCreator'

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 2,
    fontWeight: 400
  }
}

class DayPicker extends React.Component {
  handleActive (tab) {
    window.alert(`A tab with this route property ${tab.props['data-route']} was activated.`)
  }

  render () {
    const { props } = this
    return (
      <div className={props.className || ''}>
        <Tabs>
          <Tab label='Activities' />
          <Tab label='Groups' />
        </Tabs>
      </div>
    )
  }
}

export default DayPicker

 {/*<DropDownMenu value={this.state.value} onChange={this.handleChange.bind(this)}>
                  <MenuItem value={1} primaryText="All Tribes" />
                  <MenuItem value={2} primaryText="Community-based" />
                  <MenuItem value={3} primaryText="Gyms" />
                  <MenuItem value={4} primaryText="Studios" />
                  <MenuItem value={5} primaryText="Meetup groups" />
                </DropDownMenu>
              </ToolbarGroup>
              <ToolbarGroup>
                <GroupCreatorWithData
              geocoder={props.geocoder}
              profile={props.profile}
            />*/}
