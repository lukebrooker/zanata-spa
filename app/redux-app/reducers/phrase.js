import updateObject from 'react-addons-update'
import {
  CANCEL_EDIT,
  COPY_FROM_SOURCE,
  PHRASE_LIST_FETCHED,
  PHRASE_DETAIL_FETCHED,
  QUEUE_SAVE,
  SAVE_FINISHED,
  SAVE_INITIATED,
  SELECT_PHRASE,
  TRANSLATION_TEXT_INPUT_CHANGED,
  UNDO_EDIT
} from '../actions/phrases'
import {
  FIRST_PAGE,
  LAST_PAGE,
  NEXT_PAGE,
  PREVIOUS_PAGE,
} from '../actions/controlsHeaderActions'
import { calculateMaxPageIndexFromState } from '../utils/filter-paging-util'
import { mapValues } from 'lodash'

const defaultState = {
  // docId -> list of phrases (id and state)
  inDoc: {},
  // phraseId -> detail
  detail: {},
  selectedPhraseId: undefined,
  paging: {
    countPerPage: 2,
    pageIndex: 0
  }
}

const phraseReducer = (state = defaultState, action) => {
  switch (action.type) {

    case FIRST_PAGE:
      return updatePageIndex(0)

    case PREVIOUS_PAGE:
      return updatePageIndex(
        Math.max(state.paging.pageIndex - 1, 0)
      )

    case NEXT_PAGE:
      return updatePageIndex(
        Math.min(state.paging.pageIndex + 1, getMaxPageIndex())
      )

    case LAST_PAGE:
      return updatePageIndex(getMaxPageIndex())

    case CANCEL_EDIT:
      // Discard any newTranslations that were entered.
      return update({
        selectedPhraseId: {$set: undefined},
        detail: {$merge: revertEnteredTranslationsToDefault(state.detail)}
      })

    case COPY_FROM_SOURCE:
      const { phraseId, sourceIndex } = action
      return updatePhrase(phraseId, {$apply: (phrase) => {
        return copyFromSource(phrase, sourceIndex)
      }})

    case PHRASE_LIST_FETCHED:
    // select the first phrase if there is one
      const selectedPhraseId = action.phraseList.length
        ? action.phraseList[0].id
        : undefined
      return update({
        inDoc: {[action.docId]: {$set: action.phraseList}},
        selectedPhraseId: {$set: selectedPhraseId}
      })

    case PHRASE_DETAIL_FETCHED:
      const phrasesWithUiState = mapValues(action.phrases, phrase => {
        console.dir(phrase)
        return updateObject(phrase, {
          // isSaving: {$set: false},
          // FIXME can probably remove this, done elsewhere
          newTranslations: {$set: [...phrase.translations]}
        })
      })

      // TODO this shallow merge will lose data from other locales
      //      ideally replace source and locale that was looked up, leaving
      //      others unchanged (depending on caching policy)
      return update({
        detail: {$merge: phrasesWithUiState}
      })

    case QUEUE_SAVE:
      return updatePhrase(action.phraseId, {
        pendingSave: {$set: action.saveInfo}
      })

    case SAVE_FINISHED:
      const { translations } = state.detail[action.phraseId]
      return updatePhrase(action.phraseId, {
        inProgressSave: {$set: undefined},
        translations: {$set: translations},
        // TODO same as inProgressSave.status unless the server adjusted it
        status: {$set: action.status},
        revision: {$set: action.revision}
      })

    case SAVE_INITIATED:
      return updatePhrase(action.phraseId, {
        inProgressSave: {$set: action.saveInfo}
      })

    case SELECT_PHRASE:
      return update({
        selectedPhraseId: {$set: action.phraseId}
      })

    case TRANSLATION_TEXT_INPUT_CHANGED:

      // FIXME error: cannot read property "detail" of undefined
      // console.dir(state.detail[action.id].newTranslations)
      // console.dir(state.detail[action.id].newTranslations[action.index])
      // console.dir(action.text)

      return update({
        detail: {
          [action.id]: {
            newTranslations: {
              [action.index]: {$set: action.text}
            }
          }
        }
      })

    case UNDO_EDIT:
      // Discard any newTranslations that were entered.
      return update({
        detail: {$merge: revertEnteredTranslationsToDefault(state.detail)}
      })
  }

  return state

  /**
   * Apply the given commands to state.
   *
   * Just a shortcut to avoid having to pass state to update over and over.
   */
  function update (commands) {
    // FIXME update to version that does not lose reference equality when
    //       setting an identical object
    //       see: https://github.com/facebook/react/pull/4968
    return updateObject(state, commands)
  }

  /**
  * Apply commands to the indicated phrase detail.
  *
  * Returns state with just the indicated phrase changed.
  */
  function updatePhrase (phraseId, commands) {
    return update({
      detail: {
        [phraseId]: {$apply: (phrase) => {
          return updateObject(phrase, commands)
        }}
      }
    })
  }

  function updatePageIndex (newPageIndex) {
    const oldPageIndex = state.paging.pageIndex

    if (oldPageIndex !== newPageIndex) {
      return update({
        paging: {
          pageIndex: {
            $set: newPageIndex
          }
        }
      })
    }
    return state
  }

  function getMaxPageIndex () {
    return calculateMaxPageIndexFromState(action.getState())
  }

}

function revertEnteredTranslationsToDefault (phraseDetails) {
  return mapValues(phraseDetails, phrase => {
    return updateObject(phrase, {
      newTranslations: {$set: [...phrase.translations]}
    })
  })
}

function copyFromSource (phrase, sourceIndex) {
  // FIXME this data must be added to state, this will only
  //       ever copy to first until it is
  const focusedTranslationIndex = 0

  // FIXME use clamp from lodash (when lodash >= 4.0)
  const sourceIndexToCopy =
    sourceIndex < phrase.sources.length
      ? sourceIndex
      : phrase.sources.length - 1
  const sourceToCopy = phrase.sources[sourceIndexToCopy]

  return updateObject(phrase, {
    newTranslations: {
      // $splice represents an array of calls to Array.prototype.splice
      // with an array of params for each call
      $splice: [[focusedTranslationIndex, 1, sourceToCopy]]
    }
  })
}

export default phraseReducer
