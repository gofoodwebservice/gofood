import React from 'react'
import ReactDom from 'react-dom'

const MODAL_STYLES = {
  position: 'absolute',
  top: '60%',
  left: '50%',
  backgroundColor: '#0F172B',
  border: '1px solid #E4A11B',
  borderRadius: '5px',
  transform: 'translate(-50%, -50%)',
  zIndex: 1200,
  minHeight: '10%', // Modal will at least take 50% of the view height
  maxHeight: '50%', // Modal will not grow beyond 90% of the view height
  overflowY: 'auto',
  width: '80%'
}

const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, .7)',
  zIndex: 1200
}

export default function Modal({ children, onClose }) {

  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES} />
      <div style={MODAL_STYLES}>
        <button className='btn bg-danger fs-7' style={{ position:"absolute", right:"0%"}} onClick={onClose}> X </button>
        {children}
      </div>
    </>,
    document.getElementById('cart-root-desp')
  )
}