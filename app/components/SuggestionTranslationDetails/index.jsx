import Button from '../Button'
import React from 'react'
import { IntlMixin } from 'react-intl'
import SuggestionMatchPercent from '../SuggestionMatchPercent'
import SuggestionUpdateMessage from '../SuggestionUpdateMessage'

/**
 * Display metadata and copy button for the translations of a suggestion.
 */
let SuggestionTranslationDetails = React.createClass({
  mixins: [IntlMixin],

  propTypes: {
    suggestion: React.PropTypes.shape({
      copying: React.PropTypes.bool.isRequired,
      copySuggestion: React.PropTypes.func.isRequired,
      matchType: React.PropTypes.string.isRequired,
      matchDetails: React.PropTypes.arrayOf(React.PropTypes.shape({
        type: React.PropTypes.string.isRequired,
        contentState: React.PropTypes.string
      })),
      similarityPercent: React.PropTypes.number
    })
  },

  user: function (suggestion) {
    let topMatch = suggestion.matchDetails[0]
    return topMatch.lastModifiedBy || 'Anonymous'
  },

  lastChanged: function (suggestion) {
    let topMatch = suggestion.matchDetails[0]
    if (topMatch.type === 'IMPORTED_TM') {
      return topMatch.lastChanged
    }
    if (topMatch.type === 'LOCAL_PROJECT') {
      return topMatch.lastModifiedDate
    }
    console.error('match type not recognized for looking up date: ' +
                  topMatch.type)
  },

  render: function () {
    let suggestion = this.props.suggestion
    let label = suggestion.copying ? 'Copying' : 'Copy Translation'
    let matchType = suggestion.matchType
    let user = this.user(suggestion)
    let lastChanged = this.lastChanged(suggestion)

    return (
      <div className="TransUnit-details">
        <div className="u-floatLeft u-sizeLineHeight-1">
          <SuggestionUpdateMessage
            matchType={matchType}
            user={user}
            lastChanged={lastChanged}/>
        </div>
        <div className="u-floatRight u-sm-floatNone">
          <ul className="u-listInline u-sizeLineHeight-1">
            <li>
              <SuggestionMatchPercent
                matchType={matchType}
                percent={this.props.suggestion.similarityPercent}/>
            </li>
            <li>
              <Button
                className="Button Button--small u-rounded Button--primary
                           u-sizeWidth-6"
                disabled={suggestion.copying}
                onClick={suggestion.copySuggestion}
                title={label}>
                {label}
              </Button>
            </li>
          </ul>
        </div>
      </div>
    )
  }
})

export default SuggestionTranslationDetails
