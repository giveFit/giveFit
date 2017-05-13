import React from 'react'
import PropTypes from 'prop-types'

const styles = {
  container: {
    margin: '1em',
  },
  pager: {
    display: 'flex',
  },
  button: {
    border: '2px solid #efefef',
    background: 'none',
  },
}

class Pagination extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    this.forceUpdate()

    return true
  }

  pageChange (event) {
    this.props.setPage(parseInt(event.target.getAttribute('data-value')))
  }

  render () {
    let previous = ''
    let next = ''

    if (this.props.currentPage > 0) {
      previous = <span onClick={this.props.previous} className='previous'><button style={styles.button}>Back</button></span>
    }
    if (this.props.currentPage !== (this.props.maxPage - 1)) {
      next = <span onClick={this.props.next} className='next'><button style={styles.button}>Next</button></span>
    }

    const options = []
    let startIndex = Math.max(this.props.currentPage - 5, 0)
    let endIndex = Math.min(startIndex + 10, this.props.maxPage)

    if (this.props.maxPage >= 10 && (endIndex - startIndex) <= 10) {
      startIndex = endIndex - 10
    }

    for (var i = startIndex; i < endIndex; i++) {
      let selected = this.props.currentPage === i ? 'current-page-selected' : ''

      options.push(<button key={`pagination-${i}`} className={selected} data-value={i} onClick={this.pageChange.bind(this)}>{i + 1}</button>)
    }
    return (
      <div style={styles.container}>
        <div style={styles.pager}>
          <div>{previous}</div>
          <div>{next}</div>
        </div>
        <div>
          {options}
        </div>
      </div>
    )
  }
}
Pagination.propTypes = {
  maxPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,

  setPage: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  previous: PropTypes.func.isRequired,
}

export default Pagination
