import { Component } from 'react'
import { createPortal } from 'react-dom'
import { PrimaryButton } from './Buttons'
import Message from './Message'
import Spinner from './Spinner'
import TransitionFade from './TransitionFade'

/**
 * Template that is re-used on all sections of the page
 * @param {Component} modalComponent - Displays form modal for create and update
 * @param {String} message - Displays string re: error of a particular action
 * @param {String} title - Displays title of the section
 * @param {String} buttonText - Display create button text
 * @param {Function} onCreateButtonClick - Button onClick functionality
 * @param {Function} dataMapper - Maps the data on how the user wants it
 * @param {Boolean} loading - Loading indicator while waiting for data
 * @param {Array} data - Records to display to user
 * @param {Boolean} showModal - Shows modal
 */
const Section = ({
  modalComponent: ModalComponent,
  message,
  title,
  buttonText,
  onCreateButtonClick,
  dataMapper,
  loading,
  data,
  showModal,
}) => (
  <>
    <div className="space-y-4">
      <div className="flex flex-row items-center space-x-4">
        <h2 className="text-lg font-bold">{title}</h2>

        <PrimaryButton title={buttonText} onClick={onCreateButtonClick} />
      </div>
      {loading ? (
        <div className="flex flex-row space-x-2">
          <Spinner size={4} /> Loading...
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">{data?.map(dataMapper)}</div>
      )}
      {message && <Message {...message} />}
    </div>
    {ModalComponent && (
      <TransitionFade isShown={showModal}>
        {createPortal(<ModalComponent />, document.body)}
      </TransitionFade>
    )}
  </>
)

export default Section
