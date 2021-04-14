import React from 'react'
import Home from '../../pages'
import { render } from '../testUtils'

describe('Home page', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Home />, {})
    expect(asFragment()).toMatchSnapshot()
  })
})
