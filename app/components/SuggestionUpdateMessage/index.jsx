import React from 'react'
import { FormattedDate } from 'react-intl'
import Icon from '../Icon'

/**
 * Show n appropriate message about the source and time of the most
 * recent update to the translation of a suggestion.
 */
let SuggestionUpdateMessage = React.createClass({

  propTypes: {
    matchType: React.PropTypes.oneOf(['imported', 'translated', 'approved'])
      .isRequired,
    user: React.PropTypes.string,
    lastChanged: React.PropTypes.instanceOf(Date)
  },

  message: function () {
    let date = <FormattedDate value={this.props.lastChanged}
                              format="medium"/>

    switch (this.props.matchType) {
      case 'imported':
        return (
          <span>
            Last updated {date}
          </span>
        )
      case 'translated':
        return (
          <span>
            Translated by {this.props.user} on {date}
          </span>
        )
      case 'approved':
        return (
          <span>
            Approved by {this.props.user} on {date}
          </span>
        )
      default:
        console.error('invalid match type to generate message: ' +
                      this.props.matchType)
    }
  },

  render: function () {
    return (
      <span className="u-textMeta">
        <Icon name="history" className="Icon--xsm u-sMR-1-4"/>
        {this.message()}
      </span>
    )
  }
})

export default SuggestionUpdateMessage
