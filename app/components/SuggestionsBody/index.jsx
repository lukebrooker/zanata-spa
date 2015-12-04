import React from 'react'
import { IntlMixin } from 'react-intl'
import NoSuggestionsPanel from '../NoSuggestionsPanel'
import SuggestionList from '../SuggestionList'

/**
 * Display all suggestions that match the current search.
 */
let SuggestionsBody = React.createClass({
  mixins: [IntlMixin],

  propTypes: {
    search: React.PropTypes.arrayOf(React.PropTypes.string),
    showDiff: React.PropTypes.bool.isRequired,

    suggestions: React.PropTypes.arrayOf(React.PropTypes.shape({
      // true when the translation has just been copied
      copying: React.PropTypes.bool.isRequired,
      copySuggestion: React.PropTypes.func.isRequired,
      suggestion: React.PropTypes.shape({
        matchDetails: React.PropTypes.arrayOf(React.PropTypes.shape({
          type: React.PropTypes.string.isRequired,
          contentState: React.PropTypes.string
        })),
        similarityPercent: React.PropTypes.number,
        sourceContents: React.PropTypes.arrayOf(
          React.PropTypes.string).isRequired,
        targetContents: React.PropTypes.arrayOf(
          React.PropTypes.string).isRequired
      })
    }))
  },

  render: function () {
    return (
      <SuggestionList {...this.props}/>
    )
  }
})

export default SuggestionsBody
