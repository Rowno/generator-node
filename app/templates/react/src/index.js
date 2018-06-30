import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'

export default class Button extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    href: PropTypes.string
  }

  static defaultProps = {
    href: undefined
  }

  render() {
    const {children, href} = this.props

    return href ? (
      <a href={href}>{children}</a>
    ) : (
      <button type="button">{children}</button>
    )
  }
}
