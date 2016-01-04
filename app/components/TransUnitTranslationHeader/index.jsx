import React, { PropTypes } from 'react'
import IconButton from '../IconButton'
import TransUnitLocaleHeading from '../TransUnitLocaleHeading'
import { hasTranslationChanged } from 'zanata-tools/phrase'

/**
 * Heading that displays locale name and ID
 */
let TransUnitTranslationHeader = React.createClass({

  propTypes: {
    phrase: PropTypes.object.isRequired,
    cancelEdit: PropTypes.func.isRequired,
    undoEdit: PropTypes.func.isRequired,
    translationLocale: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  },

  buttonClass:
    'Link Link--neutral u-sizeHeight-1_1-2 u-sizeWidth-1 u-textCenter',

  closeButtonElement: function () {
    return (
      <li className="u-sm-hidden">
        <IconButton
          icon="cross"
          buttonClass={this.buttonClass}
          title="Cancel edit"
          onClick={this.props.cancelEdit}/>
      </li>
    )
  },

  undoButtonElement: function () {
    return (
      <li>
        <IconButton
          icon="undo"
          buttonClass={this.buttonClass}
          title="Undo edit"
          onClick={this.props.undoEdit}/>
      </li>
    )
  },

  render: function () {
    const translationChanged = hasTranslationChanged(this.props.phrase)
    const button = translationChanged
      ? this.undoButtonElement()
      : this.closeButtonElement()

    return (
      <div
        className="TransUnit-panelHeader TransUnit-panelHeader--translation">

        <TransUnitLocaleHeading
          {...this.props.translationLocale}/>

        <ul className="u-floatRight u-listHorizontal">
          {button}
        </ul>
      </div>
    )
  }
})

export default TransUnitTranslationHeader
