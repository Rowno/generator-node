import React, { FunctionComponent } from 'react'
import PropTypes from 'prop-types'

interface ButtonProps {
  children: React.ReactNode
  href?: string
}

const Button: FunctionComponent<ButtonProps> = props => {
  const { children, href } = props

  return href === undefined ? <button type="button">{children}</button> : <a href={href}>{children}</a>
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string
}

Button.defaultProps = {
  href: undefined
}

export default Button
