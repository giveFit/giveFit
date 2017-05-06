import React from 'react'
import AutoComplete from 'material-ui/AutoComplete'

const dataSource2 = ['yoga', 'thai-chi', 'running']

export default class Search extends React.Component {
  /* constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
    };
    this.handleUpdateInput = this.handleUpdateInput.bind(this);
  };

  handleUpdateInput(value){
    this.setState({
      dataSource: [
        value,
        value + value,
      ],
    });
  } */

  render () {
    return (
      <div>
        <AutoComplete
          floatingLabelText="Select type of workout group"
          filter={AutoComplete.noFilter}
          openOnFocus={true}
          dataSource={dataSource2}
        />
      </div>
    )
  }
}
