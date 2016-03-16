import Button from './Button'
import React, { PropTypes } from 'react'
import SuggestionMatchPercent from './SuggestionMatchPercent'
import SuggestionUpdateMessage from './SuggestionUpdateMessage'

/**
 * Display metadata and copy button for the translations of a suggestion.
 */
const SuggestionTranslationDetails = React.createClass({
  propTypes: {
    suggestion: PropTypes.shape({
      copying: PropTypes.bool.isRequired,
      copySuggestion: PropTypes.func.isRequired,
      matchType: PropTypes.string.isRequired,
      matchDetails: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string.isRequired,
        contentState: PropTypes.string
      })),
      similarityPercent: PropTypes.number
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
    const suggestion = this.props.suggestion
    const label = suggestion.copying ? 'Copied' : 'Copy Translation'
    const matchType = suggestion.matchType
    const user = this.user(suggestion)
    // TODO convert these to Date in the api module instead
    //      (so new date instances are not created every render)
    const lastChanged = new Date(this.lastChanged(suggestion))

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
