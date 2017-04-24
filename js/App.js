import React from 'react'
import axios from 'axios'

class NoteApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {notes: []}
    
  }

  async componentDidMount() {
    const response = await axios.get('/notes')
    this.state.notes.concat(response.data)
  }

  render() {
    return (
      <div className="Notes">
      </div>
    )
  }
}