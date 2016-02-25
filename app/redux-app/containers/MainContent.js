import React, { PropTypes } from 'react'
import Icon from '../components/Icon'
import TransUnit from '../components/TransUnit'
import ShortcutEnabledComponent from './ShortcutEnabledComponent'
import { connect } from 'react-redux'
import { getCurrentPagePhrasesFromState } from '../utils/filter-paging-util'

/**
 * Single row in the editor displaying a whole phrase.
 * Including source, translation, metadata and editing
 * facilities.
 */
const MainContent = React.createClass({

  propTypes: {
    // from editorContent.phrases
    phrases: PropTypes.arrayOf(PropTypes.object).isRequired
  },

  render: function () {
    console.log('MainContent')
    console.dir(this.props)

    const phrases = this.props.phrases

    if (phrases.length === 0) {
      // TODO translate "No content"
      return (
        <div className="u-posCenterCenter u-textEmpty u-textCenter">
          <Icon name="translate"
                className="Icon--lg Icon--circle u-sMB-1-4"/>
          <p>No content</p>
        </div>
      )
    }

    const transUnits = phrases.map((phrase, index) => {
      // FIXME maybe use phrase id, next page will have
      //       same index for different id. Not sure if
      //       that will matter though.

      // phrase is passed as a prop to avoid complexity of trying to get at
      // the phrase from state in mapDispatchToProps
      return (
        <li key={index}>
          <TransUnit index={index} phrase={phrase}/>
        </li>
      )
    })

    // TODO scrollbar width container+child were not brought over
    //      from the angular code yet.
    return (
        <ShortcutEnabledComponent>
      <main role="main"
        id="editor-content"
        className="Editor-content TransUnit-container">
        <div className="Editor-translationsWrapper">
          <ul className="Editor-translations">
            {transUnits}
          </ul>
        </div>
      </main>
        </ShortcutEnabledComponent>
    )
  }
})

function mapStateToProps (state, ownProps) {
  const minimalPhrases = getCurrentPagePhrasesFromState(state)
  const detailPhrases = minimalPhrases.map(phrase => {
    const detail = state.phrases.detail[phrase.id]
    return detail || phrase
  })

  return {
    context: state.context,
    phrases: detailPhrases
  }
}

export default connect(mapStateToProps)(MainContent)
