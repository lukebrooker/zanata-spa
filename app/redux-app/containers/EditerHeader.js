import cx from 'classnames'
import ControlsHeader from '../components/ControlsHeader'
import NavHeader from '../components/NavHeader'
import ProgressBar from '../components/ProgressBar'
import { connect } from 'react-redux'
import React, { PropTypes } from 'react'

/**
 * Header for navigation and control of the editor
 */
let EditorHeader = React.createClass({

  propTypes: {
    navHeaderVisible: PropTypes.bool.isRequired,
    counts: PropTypes.shape({
      total: PropTypes.number,
      approved: PropTypes.number,
      translated: PropTypes.number,
      needswork: PropTypes.number,
      untranslated: PropTypes.number
    })
  },

  render: function () {
    let className = cx('Header', 'Editor-header',
        { 'is-minimised': !this.props.navHeaderVisible })
    return (
        <header role="banner"
                className={className}
                focus-on="editor-header">
          <NavHeader />
          <ControlsHeader />
          <ProgressBar
              size="small"
              counts={this.props.counts}/>
        </header>
    )
  }
})

function mapStateToProps (state) {
  return {
    navHeaderVisible: state.ui.panels.navHeader.visible,
    counts: state.data.context.selectedDoc.counts,
    ui: state.ui
  }
}



export default connect(mapStateToProps)(EditorHeader)
