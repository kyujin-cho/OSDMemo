import React from 'react'
import axios from 'axios'
require('babel-polyfill')

class NoteApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {notes: []}
  }

  addNote(note) {
    const index = this.state.notes.length
    const newNotes = this.state.notes.concat(<Note data={note} key={index} deleteNote={this.deleteNote.bind(this)}/>)
    console.log(newNotes)
    
    this.setState({
      notes: newNotes
    })
  }

  async deleteNote(note) {
    const response = await axios.delete('/api/notes/' + note._id)
    if(response.data.success) {
      const newNotes = this.state.notes
      newNotes.pop(note)
      this.setState({
        notes: newNotes
      })
    }
  }

  async componentDidMount() {
    const response = await axios.get('/api/notes')
    console.log(response)
    let newNote = []
    await response.data.result.forEach((note, index) => {
      newNote.push(<Note data={note} key={index} deleteNote={this.deleteNote.bind(this)}/>)
    })
    this.setState({notes: newNote})
  }

  closeDrawer() {
    const drawer = document.getElementsByClassName('mdl-layout__drawer')[0]
    drawer.className = 'mdl-layout__drawer'
    drawer.setAttribute('aria-hidden', 'true')
    document.getElementsByClassName('mdl-layout__drawer-button')[0].setAttribute('aria-expanded', 'false')
    document.getElementsByClassName('mdl-layout__obfuscator')[0].className = 'mdl-layout__obfuscator'
  }

  showNote() {
    document.getElementsByClassName('notes')[0].setAttribute('style', 'display: block;')
    document.getElementsByClassName('writeNote')[0].setAttribute('style', 'display: none;')
    document.getElementsByClassName('settings')[0].setAttribute('style', 'display: none;')
    this.closeDrawer()
  }

  showWriteNote() {
    document.getElementsByClassName('notes')[0].setAttribute('style', 'display: none;')
    document.getElementsByClassName('writeNote')[0].setAttribute('style', 'display: block;')
    document.getElementsByClassName('settings')[0].setAttribute('style', 'display: none;')
    this.closeDrawer()
  }

  showSetting() {
    document.getElementsByClassName('notes')[0].setAttribute('style', 'display: none;')
    document.getElementsByClassName('writeNote')[0].setAttribute('style', 'display: none;')
    document.getElementsByClassName('settings')[0].setAttribute('style', 'display: block;')
    this.closeDrawer()
  }

  render() {
    return (
      <div className="layout-transparent mdl-layout mdl-js-layout">
        <header className="mdl-layout__header mdl-layout__header--transparent">
          <div className="mdl-layout__header-row">
            <span className="mdl-layout-title">Note Taking App</span>
            <div className="mdl-layout-spacer"></div>
            <form action="/search" method="post">
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable">
                <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="search-exp">
                  <i className="material-icons">search</i>
                </label>
                <div className="mdl-textfield__expandable-holder">
                  <input className="mdl-textfield__input" id="search-exp" type="text"/>
                </div>
              </div>
            </form>
          </div>
        </header>
        <div className="mdl-layout__drawer">
          <span className="mdl-layout-title">Note Taking App</span>
          <nav className="mdl-navigation">
            <a className="mdl-navigation__link" onClick={this.showNote.bind(this)}>View Notes</a>
            <a className="mdl-navigation__link" onClick={this.showWriteNote.bind(this)}>Write Note</a>
            <a className="mdl-navigation__link" onClick={this.showSetting.bind(this)}>Settings</a>
          </nav>
        </div>
        <main className="mdl-layout__content">
          <div className="notes">
            {this.state.notes}
          </div>
          {/*<Notes className="notes" notes={this.state.notes} addNote={this.addNote.bind(this)} />*/}
          <WriteNote className="writeNote" addNote={this.addNote.bind(this)} showNote={this.showNote.bind(this)} />
          <Settings className="settings" />
        </main>
      </div>
    )
  }
}

class Note extends React.Component {
  render() {
    return (
      <div className="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mld-cell--4-col-phone">
        <div className="demo-card-wide mdl-card mdl-shadow--2dp">
          <div className="mdl-card__title">
            <h2 className="mdl-card__title-text">{this.props.data.title}</h2>
          </div>
          <div className="mdl-card__supporting-text">
            <span>{this.props.data.contents}</span>
          </div>
          <div className="mdl-card-actions mdl-card--border">
            <div className="mdl-grid">
              <div className="mdl-cell mdl-cell--1-col mdl-cell--1-col-tablet mdl-cell--1-col-phone">
                <i className="material-icons">date_range</i>
              </div>
              <div className="mdl-cell mdl-cell--3-col mdl-cell--3-col-tablet mdl-cell--3-col-phone">
                <span>{this.props.data.date}</span>
              </div>
              <div className="mdl-cell mdl-cell--1-col mdl-cell--1-col-tablet mdl-cell--1-col-phone">
                <i className="material-icons">location_on</i>
              </div>
              <div className="mdl-cell mdl-cell--3-col mdl-cell--3-col-tablet mdl-cell--3-col-phone">
                <span>Seoul, Korea</span>
              </div>
              <div className="mdl-cell mdl-cell--2-col mdl-cell--7-col-tablet mdl-cell--2-col-phone">
                <button className="right-align mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab">
                <i className="material-icons">edit</i>
                </button>
              </div>
              <div className="mdl-cell mdl-cell--2-col mdl-cell--1-col-tablet mdl-cell--2-col-phone">
                <button className="right-align mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab" onClick={() => {this.props.deleteNote(this.props.data)}}>
                <i className="material-icons">delete</i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class WriteNote extends React.Component {
  constructor(props) {
    super(props)
    this.state = {title: '', contents: ''}
  }
  changeTitle(event) {
    this.setState({
      title: event.target.value
    })
  }
  changeContents(event) {
    this.setState({
      contents: event.target.value
    })
  }
  async writeNote(event) {
    event.preventDefault()
    const title = this.state.title
    const contents = this.state.contents

    const response = await axios.post('/api/notes', {
      title: title, 
      contents: contents
    })

    console.log(response.data)
    
    if(response.data.success) {
      this.props.addNote(response.data.note)
      this.state.title = this.state.contents = ''
      this.props.showNote()
    }
  }
  render() {
    return (
      <div className="write-card-wide mdl-card mdl-shadow--2dp writeNote" style={{display: 'none'}} >
        <div className="mdl-card__title">
          <h2 className="mdl-card__title-text">Write Memo</h2>
        </div>
        <div className="mdl-card__supporting-text">
          <form onSubmit={this.writeNote.bind(this)}>
            <div className="mdl-grid">
              <div className="mdl-cell--12-col">
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                  <input className="mdl-textfield__input" id="title-text" value={this.state.title} onChange={this.changeTitle.bind(this)} type="text" name="title"/>
                  <label className="mdl-textfield__label" htmlFor="title-text">Title</label>
                </div>
              </div>
              <div className="mdl-cell--12-col">
                <div className="mdl-textfield mdl-js-textfield">
                  <textarea className="mdl-textfield__input" id="title-text" value={this.state.contents} onChange={this.changeContents.bind(this)} type="text" name="contents" rows="10"></textarea>
                  <label className="mdl-textfield__label" htmlFor="contents-text">Content</label>
                </div>
              </div>
              <div className="mdl-cell--12-col">
                <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored right-align" type="submit">Write</button>
              </div>
            </div>
          </form>
        </div>
        <div className="mdl-card-actions mdl-card--border" />
      </div>
    )
  }
}

class Settings extends React.Component {
  render() {
    return (
      <div className="settings-card-wide mdl-card mdl-shadow--2dp settings" style={{display: 'none'}}>
        <div className="mdl-card__title">
          <h2 className="mdl-card__title-text">Settings</h2>
        </div>
        <div className="mdl-card__supporting-text">
          <ul className="mdl-list">
            <li className="mdl-list__item mdl-list__item--three-line">
              <span className="mdl-list__item-primary-content">
                <span className="settings-title">Github Integration</span>
                <span className="mdl-list__item-text-body">Log in to sync your memo with Github repository</span>
              </span>
              <span className="mdl-list__item-secondary-content">
                <button className="mdl-button mdl-js-button mdl-button--fab mdl-button--colored">
                  <i className="material-icons">arrow_forward</i>
                </button>
              </span>
            </li>
            <li className="mdl-list__item mdl-list__item--three-line">
              <span className="mdl-list__item-primary-content">
                <span className="settings-title">Change Background</span>
                <span className="mdl-list__item-text-body">Upload new background image</span>
              </span>
              <span className="mdl-list__item-secondary-content">
                <button className="mdl-button mdl-js-button mdl-button--fab mdl-button--colored">
                  <i className="material-icons">file_upload</i>
                </button>
              </span>
            </li>
            <li className="mdl-list__item mdl-list__item--three-line">
              <span className="mdl-list__item-primary-content">
                <span className="settings-title">Set password</span>
                <span className="mdl-list__item-text-body">Set password to protect your memo</span>
              </span>
              <span className="mdl-list__item-secondary-content">
                <button className="mdl-button mdl-js-button mdl-button--fab mdl-button--colored">
                  <i className="material-icons">enhanced_encryption</i>
                </button>
              </span>
            </li>
            <li className="mdl-list__item mdl-list__item--three-line">
              <span className="mdl-list__item-primary-content">
                <span className="settings-title">Change time zome</span>
                <span className="mdl-list__item-text-body">Change your Time Zone</span>
              </span>
              <span className="mdl-list__item-secondary-content">
                <button className="mdl-button mdl-js-button mdl-button--fab mdl-button--colored">
                  <i className="material-icons">language</i>
                </button>
              </span>
            </li>
          </ul>
        </div>
        <div className="mdl-card-actions mdl-card--border"></div>
      </div>
    )
  }
}

export default NoteApp