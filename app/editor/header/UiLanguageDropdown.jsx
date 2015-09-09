/* global React, UiLanguageDropdown, Dropdown */

/**
 * Dropdown component that wraps a toggle button and some content to toggle.
 */
UiLanguageDropdown = React.createClass({

  propTypes: {
    // editor.getLocaleName(app.myInfo.locale.localeId)
    localeName: React.PropTypes.string,
    toggleDropdown: React.PropTypes.func.isRequired,
    isOpen: React.PropTypes.bool.isRequired,
    // app.uiLocaleList
    uiLocales: React.PropTypes.arrayOf(React.PropTypes.shape({
      localeId: React.PropTypes.string,
      name: React.PropTypes.string
    })),
    changeUiLocale: React.PropTypes.func.isRequired
  },

  localeUrl: function (locale) {
    return '#/' + this.props.projectSlug + '/' + this.props.versionSlug
        + '/translate/' + this.props.encodedDocId + '/' + locale.localeId;
  },

  changeUiLocale: function (locale) {
    return () => this.props.changeUiLocale(locale);
  },

  render: function() {
    let items = this.props.uiLocales.map(locale => {
      return (
        <li key={locale.localeId}>
          <a onClick={this.changeUiLocale(locale)}
             className="Dropdown-item">
            {locale.name}
          </a>
        </li>
      );
    });

    let toggleButton = (
      <a className="Link--invert u-inlineBlock u-textNoWrap u-sPH-1-4">
        {this.props.localeName}
      </a>
    );

    return (
      <Dropdown button={toggleButton}
                onToggle={this.props.toggleDropdown}
                isOpen={this.props.isOpen}
                className="Dropdown--right u-sMV-1-2">
        <ul>
          {items}
        </ul>
      </Dropdown>
    );
  }
});
